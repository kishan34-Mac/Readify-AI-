const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parseProjectStructure } = require("../utils/parseProject");
const Readme = require("../models/Readme");

const cleanEnvValue = (value = "") => value.trim().replace(/^['"]|['"]$/g, "");
const MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const GITHUB_API_BASE = "https://api.github.com";
const IGNORE_PATH_PATTERNS = ["node_modules/", ".git/", "dist/", "build/", ".next/", ".turbo/", "coverage/"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractStatusCode = (error) => {
  const status = error?.status || error?.statusCode;

  if (typeof status === "number") {
    return status;
  }

  const message = String(error?.message || "");
  const match = message.match(/\[(\d{3})[^\]]*\]/);

  return match ? Number(match[1]) : null;
};

const isRetryableError = (error) => {
  const statusCode = extractStatusCode(error);
  return statusCode ? RETRYABLE_STATUS_CODES.has(statusCode) : false;
};

const shouldIgnoreGitHubPath = (path = "") =>
  IGNORE_PATH_PATTERNS.some((pattern) => path.includes(pattern));

const getGitHubHeaders = () => {
  const token = cleanEnvValue(process.env.GITHUB_TOKEN || "");
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "readify-ai-pro",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const githubRequest = async (pathname) => {
  const response = await fetch(`${GITHUB_API_BASE}${pathname}`, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `GitHub request failed with status ${response.status}.`);
  }

  return response.json();
};

const parseRepoUrl = (repoUrl = "") => {
  try {
    const parsedUrl = new URL(repoUrl.trim());
    const [, owner, repo] = parsedUrl.pathname.replace(/\.git$/, "").split("/");

    if (!owner || !repo) {
      return null;
    }

    return { owner, repo, fullName: `${owner}/${repo}` };
  } catch {
    return null;
  }
};

const buildFolderPrompt = ({ structureMap, fileCount }) => `
You are an expert software engineer writing a polished README.md for an uploaded project.

Project facts:
- Uploaded file count: ${fileCount}
- Visible project structure:
${structureMap}

Write a complete README in Markdown only.

Requirements:
- Make the README visually attractive and easy to scan.
- Use tasteful emoji in the title and section headings.
- Start with a strong project title inferred from the structure.
- Add a short, exciting overview paragraph.
- Add a Highlights or Features section based only on reasonable inferences from filenames and folders.
- Add a Tech Stack section if it can be inferred.
- Add a Project Structure section with a short explanation.
- Add Installation and Usage sections with safe, practical commands.
- Add an API/Backend section if the project appears full-stack.
- Add an Environment Variables section and include GEMINI_API_KEY if relevant.
- Add a Why This Project or Use Cases section when it fits.
- Add a Notes/Limits section that clearly says some details were inferred from filenames.
- Use good Markdown formatting with bullets, code blocks, tables only when useful, and readable spacing.
- Keep the README professional, modern, and attractive rather than overly long.
- Do not mention that you are an AI.
- Do not wrap the output in code fences.
`;

const buildRepoPrompt = ({ repo, structureMap, languages }) => `
You are an expert software engineer writing a polished README.md for a public GitHub repository.

Repository facts:
- Full name: ${repo.full_name}
- Name: ${repo.name}
- Description: ${repo.description || "No description provided."}
- Primary language: ${repo.language || "Unknown"}
- Topics: ${(repo.topics || []).join(", ") || "None listed"}
- Stars: ${repo.stargazers_count}
- Forks: ${repo.forks_count}
- Default branch: ${repo.default_branch}
- Visible file structure:
${structureMap}
- Language breakdown:
${languages}

Write a complete README in Markdown only.

Requirements:
- Make it feel modern, attractive, and GitHub-ready.
- Use tasteful emoji in the project title and section headings.
- Include Overview, Features, Tech Stack, Project Structure, Installation, Usage, and Notes.
- Include Setup/Environment sections only when relevant.
- Infer features carefully from repository metadata and structure without inventing hidden implementation details.
- Mention that some details are inferred from the public repository structure if necessary.
- Do not mention that you are an AI.
- Do not wrap the output in code fences.
`;

const buildUserPrompt = ({ profile, repos, missingReadmeRepos, totalPublicRepoCount }) => `
You are writing a polished GitHub profile README in Markdown for a developer.

Developer facts:
- Username: ${profile.login}
- Name: ${profile.name || profile.login}
- Bio: ${profile.bio || "No bio provided."}
- Company: ${profile.company || "Not specified"}
- Location: ${profile.location || "Not specified"}
- Public repos scanned: ${totalPublicRepoCount}
- Public repos missing a README: ${missingReadmeRepos.length}

Repository summary:
${repos
  .map((repo, index) => {
    const topics = repo.topics?.length ? repo.topics.join(", ") : "No topics";
    return `${index + 1}. ${repo.name} | ${repo.language || "Unknown language"} | ⭐ ${repo.stargazers_count} | ${repo.description || "No description"} | Topics: ${topics}`;
  })
  .join("\n")}

Repositories currently missing a README:
${missingReadmeRepos.length > 0
  ? missingReadmeRepos
      .map(
        (repo, index) =>
          `${index + 1}. ${repo.name} | ${repo.language} | ⭐ ${repo.stars} | ${repo.description} | ${repo.htmlUrl}`,
      )
      .join("\n")
  : "None. Every scanned public repository already appears to have a README."}

Write a complete GitHub profile README in Markdown only.

Requirements:
- Make it attractive, modern, and portfolio-ready.
- Use tasteful emoji in the heading and section titles.
- Include a strong intro, About Me, Featured Projects, Tech Focus, and Contact/Next Steps sections.
- Curate the most meaningful repositories from the scanned list instead of dumping every repo equally.
- Include a dedicated section named "Repositories That Still Need a README" and list the repos missing one.
- If all scanned repos already have a README, clearly say that in that section.
- Keep the tone professional and credible.
- If details are missing, be honest and infer carefully from the repo metadata only.
- Do not mention that you are an AI.
- Do not wrap the output in code fences.
`;

const generateWithModel = async (genAI, modelName, prompt) => {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const readmeText = response.text().trim();

  if (!readmeText) {
    throw new Error(`Gemini returned an empty README for model ${modelName}.`);
  }

  return readmeText;
};

const generateReadmeWithRetry = async (genAI, prompt) => {
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        return await generateWithModel(genAI, modelName, prompt);
      } catch (error) {
        lastError = error;
        const retryable = isRetryableError(error);
        const isLastAttempt = attempt === 3;

        console.error(
          `README generation attempt failed for ${modelName} (attempt ${attempt}/3):`,
          error?.message || error,
        );

        if (!retryable || isLastAttempt) {
          break;
        }

        await sleep(attempt * 1200);
      }
    }
  }

  throw lastError || new Error("README generation failed.");
};

const getGenAIClient = () => {
  const apiKey = cleanEnvValue(process.env.GEMINI_API_KEY || "");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env and restart the server.");
  }

  return new GoogleGenerativeAI(apiKey);
};

const inferTitleFromReadme = (readmeText, fallbackTitle) => {
  const titleMatch = readmeText.match(/^#\s+(.+)$/m);
  return (titleMatch?.[1] || fallbackTitle || "Generated README").trim();
};

const saveReadmeForUser = async ({ user, title, sourceType, sourceLabel, content }) => {
  if (!user?._id) {
    return null;
  }

  return Readme.create({
    user: user._id,
    title,
    sourceType,
    sourceLabel,
    content,
  });
};

const fetchRepoContext = async (repoUrl) => {
  const repoRef = parseRepoUrl(repoUrl);

  if (!repoRef) {
    throw new Error("Enter a valid public GitHub repository URL.");
  }

  const repo = await githubRequest(`/repos/${repoRef.owner}/${repoRef.repo}`);
  const branch = await githubRequest(`/repos/${repoRef.owner}/${repoRef.repo}/branches/${encodeURIComponent(repo.default_branch)}`);
  const tree = await githubRequest(`/repos/${repoRef.owner}/${repoRef.repo}/git/trees/${branch.commit.commit.tree.sha}?recursive=1`);
  const languagesMap = await githubRequest(`/repos/${repoRef.owner}/${repoRef.repo}/languages`);

  const structureMap = (tree.tree || [])
    .filter((entry) => entry.type === "blob" && !shouldIgnoreGitHubPath(entry.path))
    .map((entry) => entry.path)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 400)
    .join("\n");

  const languages = Object.keys(languagesMap).length
    ? Object.entries(languagesMap)
        .sort((a, b) => b[1] - a[1])
        .map(([language, bytes]) => `${language}: ${bytes} bytes`)
        .join("\n")
    : "No language data available.";

  return {
    repo,
    structureMap: structureMap || "No visible files found.",
    languages,
  };
};

const fetchUserContext = async (username) => {
  const normalizedUsername = username.trim().replace(/^@/, "");

  if (!normalizedUsername) {
    throw new Error("Enter a valid GitHub username.");
  }

  const profile = await githubRequest(`/users/${encodeURIComponent(normalizedUsername)}`);
  const repos = await githubRequest(
    `/users/${encodeURIComponent(normalizedUsername)}/repos?per_page=100&type=public&sort=updated`,
  );

  const publicRepos = repos.filter((repo) => !repo.fork);

  const repoReadmeChecks = await Promise.all(
    publicRepos.map(async (repo) => {
      try {
        await githubRequest(`/repos/${profile.login}/${repo.name}/readme`);
        return { ...repo, hasReadme: true };
      } catch (error) {
        const message = String(error?.message || "");
        if (message.includes("Not Found")) {
          return { ...repo, hasReadme: false };
        }

        return { ...repo, hasReadme: true };
      }
    }),
  );

  const curatedRepos = repoReadmeChecks
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 18);

  if (curatedRepos.length === 0) {
    throw new Error("No public repositories were found for that GitHub username.");
  }

  const missingReadmeRepos = repoReadmeChecks
    .filter((repo) => !repo.hasReadme)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "No description",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
    }));

  return {
    profile,
    repos: curatedRepos,
    missingReadmeRepos,
    totalPublicRepoCount: publicRepos.length,
  };
};

const sendGeneratedReadme = async ({ req, res, prompt, sourceType, sourceLabel, fallbackTitle }) => {
  const genAI = getGenAIClient();
  const readmeText = await generateReadmeWithRetry(genAI, prompt);
  const title = inferTitleFromReadme(readmeText, fallbackTitle);
  const savedReadme = await saveReadmeForUser({
    user: req.user,
    title,
    sourceType,
    sourceLabel,
    content: readmeText,
  });

  res.json({
    readme: readmeText,
    savedReadmeId: savedReadme ? String(savedReadme._id) : null,
  });
};

const generateReadme = async (req, res) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length === 0) {
      return res.status(400).json({ error: "No project files were uploaded." });
    }

    const structureMap = parseProjectStructure(files);
    const prompt = buildFolderPrompt({ structureMap, fileCount: files.length });
    const rootFolder = files[0]?.originalname?.split("/")[0] || "uploaded-project";
    await sendGeneratedReadme({
      req,
      res,
      prompt,
      sourceType: "folder",
      sourceLabel: rootFolder,
      fallbackTitle: rootFolder,
    });
  } catch (error) {
    console.error("README generation failed:", error);
    res.status(500).json({
      error:
        isRetryableError(error)
          ? "Gemini is temporarily busy. Please try again in a few seconds."
          : error.message || "Server failed while generating the README.",
    });
  }
};

const generateReadmeFromRepo = async (req, res) => {
  try {
    const repoUrl = req.body?.repoUrl || "";
    const { repo, structureMap, languages } = await fetchRepoContext(repoUrl);
    const prompt = buildRepoPrompt({ repo, structureMap, languages });
    await sendGeneratedReadme({
      req,
      res,
      prompt,
      sourceType: "repo",
      sourceLabel: repo.full_name,
      fallbackTitle: repo.name,
    });
  } catch (error) {
    console.error("GitHub repo README generation failed:", error);
    res.status(500).json({
      error:
        isRetryableError(error)
          ? "Gemini is temporarily busy. Please try again in a few seconds."
          : error.message || "Could not generate a README from that repository.",
    });
  }
};

const generateReadmeFromUser = async (req, res) => {
  try {
    const username = req.body?.username || "";
    const { profile, repos, missingReadmeRepos, totalPublicRepoCount } = await fetchUserContext(username);
    const prompt = buildUserPrompt({ profile, repos, missingReadmeRepos, totalPublicRepoCount });
    await sendGeneratedReadme({
      req,
      res,
      prompt,
      sourceType: "user",
      sourceLabel: profile.login,
      fallbackTitle: `${profile.login}-profile-readme`,
    });
  } catch (error) {
    console.error("GitHub user README generation failed:", error);
    res.status(500).json({
      error:
        isRetryableError(error)
          ? "Gemini is temporarily busy. Please try again in a few seconds."
          : error.message || "Could not generate a README from that GitHub username.",
    });
  }
};

module.exports = { generateReadme, generateReadmeFromRepo, generateReadmeFromUser };
