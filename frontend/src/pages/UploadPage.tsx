import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderOpen,
  FolderUp,
  Github,
  Loader2,
  Sparkles,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5001";

type GenerationMode = "folder" | "repo" | "user";

type FileWithRelativePath = File & {
  webkitRelativePath: string;
};

type FileSystemEntry = {
  isFile: boolean;
  isDirectory: boolean;
  fullPath: string;
  name: string;
};

type FileSystemFileEntry = FileSystemEntry & {
  file: (callback: (file: File) => void, errorCallback?: (error: DOMException) => void) => void;
};

type FileSystemDirectoryEntry = FileSystemEntry & {
  createReader: () => {
    readEntries: (
      successCallback: (entries: FileSystemEntry[]) => void,
      errorCallback?: (error: DOMException) => void,
    ) => void;
  };
};

type DataTransferItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => FileSystemEntry | null;
};

const IGNORE_PATTERNS = ["node_modules/", ".git/", "dist/", "build/", ".next/"];

const shouldIgnorePath = (path: string) =>
  IGNORE_PATTERNS.some((pattern) => path.includes(pattern));

const withRelativePath = (file: File, relativePath: string) =>
  Object.defineProperty(file, "webkitRelativePath", {
    value: relativePath,
    configurable: true,
  }) as FileWithRelativePath;

const readFileEntry = (entry: FileSystemFileEntry) =>
  new Promise<FileWithRelativePath>((resolve, reject) => {
    entry.file(
      (file) => {
        const relativePath = entry.fullPath.replace(/^\/+/, "");
        resolve(withRelativePath(file, relativePath || entry.name));
      },
      reject,
    );
  });

const readAllDirectoryEntries = async (
  directoryReader: ReturnType<FileSystemDirectoryEntry["createReader"]>,
) => {
  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });

    if (batch.length === 0) {
      return entries;
    }

    entries.push(...batch);
  }
};

const collectFilesFromEntry = async (entry: FileSystemEntry): Promise<FileWithRelativePath[]> => {
  if (shouldIgnorePath(entry.fullPath)) {
    return [];
  }

  if (entry.isFile) {
    return [await readFileEntry(entry as FileSystemFileEntry)];
  }

  if (entry.isDirectory) {
    const directoryEntry = entry as FileSystemDirectoryEntry;
    const nestedEntries = await readAllDirectoryEntries(directoryEntry.createReader());
    const nestedFiles = await Promise.all(
      nestedEntries.map((nestedEntry) => collectFilesFromEntry(nestedEntry)),
    );

    return nestedFiles.flat();
  }

  return [];
};

const normalizeFiles = (incomingFiles: File[]) => {
  const filteredFiles = incomingFiles.filter((file) => {
    const relativePath =
      (file as FileWithRelativePath).webkitRelativePath || file.name;

    return !shouldIgnorePath(relativePath);
  });

  const uniqueFiles = new Map<string, File>();

  filteredFiles.forEach((file) => {
    const relativePath =
      (file as FileWithRelativePath).webkitRelativePath || file.name;
    uniqueFiles.set(relativePath, file);
  });

  return Array.from(uniqueFiles.values());
};

export default function UploadPage() {
  const [mode, setMode] = useState<GenerationMode>("folder");
  const [files, setFiles] = useState<File[] | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const goToEditor = (readme: string, savedReadmeId?: string | null) => {
    navigate("/dashboard/editor", {
      state: { generatedReadme: readme, savedReadmeId: savedReadmeId || null },
    });
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(normalizeFiles(Array.from(e.target.files)));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items || []);
    if (items.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      const entries = items
        .map((item) => (item as DataTransferItemWithEntry).webkitGetAsEntry?.())
        .filter((entry): entry is FileSystemEntry => Boolean(entry));

      const droppedFiles =
        entries.length > 0
          ? (await Promise.all(entries.map((entry) => collectFilesFromEntry(entry)))).flat()
          : Array.from(e.dataTransfer.files);

      const normalizedFiles = normalizeFiles(droppedFiles);

      if (normalizedFiles.length === 0) {
        toast({
          title: "No valid files found",
          description: "Drop a project folder with readable files.",
          variant: "destructive",
        });
        return;
      }

      setFiles(normalizedFiles);
      toast({
        title: "Folder ready",
        description: `${normalizedFiles.length} files prepared for generation.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Drop failed",
        description: "Could not read the folder. Try the file picker if needed.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequest = async (endpoint: string, init: RequestInit, successMessage: string) => {
    setIsGenerating(true);

    try {
      const headers = new Headers(init.headers || {});
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...init,
        headers,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate README");
      }

      toast({
        title: "README ready",
        description: successMessage,
      });
      goToEditor(data.readme, data.savedReadmeId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFolderGenerate = async () => {
    if (!files || files.length === 0) {
      toast({
        title: "No folder selected",
        description: "Choose or drop a project folder first.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("projectFiles", file, file.webkitRelativePath || file.name);
    });

    await handleRequest(
      "/api/generate",
      { method: "POST", body: formData },
      "Folder structure scanned and README generated.",
    );
  };

  const handleRepoGenerate = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repo URL required",
        description: "Paste a public GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    await handleRequest(
      "/api/generate/repo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      },
      "Public repository scanned and README generated.",
    );
  };

  const handleUserGenerate = async () => {
    if (!username.trim()) {
      toast({
        title: "GitHub username required",
        description: "Enter a public GitHub username to scan repositories.",
        variant: "destructive",
      });
      return;
    }

    await handleRequest(
      "/api/generate/user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      },
      "GitHub profile repositories scanned and README generated.",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto max-w-6xl"
    >
      <Card className="overflow-hidden rounded-[2rem] border-border/60 bg-card/85 shadow-[0_40px_120px_-80px_hsl(var(--foreground)/0.35)]">
        <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Generation Studio</p>
              <CardTitle className="mt-3 font-display text-3xl tracking-tight">
                Generate README from folders, repo links, or a GitHub profile
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-sm leading-6">
                Choose the input source you have right now. Readify can scan a local project folder, a public GitHub
                repository URL, or a GitHub username and turn it into a cleaner README draft.
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Animated workflow with modern export-ready editing
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Tabs value={mode} onValueChange={(value) => setMode(value as GenerationMode)} className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-[1.5rem] border border-border/60 bg-background/80 p-1">
                <TabsTrigger value="folder" className="rounded-[1.2rem] py-3">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Folder
                </TabsTrigger>
                <TabsTrigger value="repo" className="rounded-[1.2rem] py-3">
                  <Github className="mr-2 h-4 w-4" />
                  Repo Link
                </TabsTrigger>
                <TabsTrigger value="user" className="rounded-[1.2rem] py-3">
                  <UserRound className="mr-2 h-4 w-4" />
                  GitHub User
                </TabsTrigger>
              </TabsList>

              <TabsContent value="folder" className="mt-5">
                <motion.div
                  key="folder-panel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "rounded-[1.75rem] border border-dashed p-8 transition-all duration-300",
                      isDragging
                        ? "border-primary bg-primary/10 shadow-[0_30px_80px_-50px_hsl(var(--primary)/0.85)]"
                        : "border-border bg-muted/30",
                    )}
                  >
                    <div className="mb-6 flex flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-[1.5rem] bg-primary/10 p-4 text-primary">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-base font-semibold">Drop your project folder here</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Chromium-based browsers support full folder drag and drop best.
                        </p>
                      </div>
                    </div>

                    <Input
                      type="file"
                      {...{ webkitdirectory: "true", directory: "true" }}
                      onChange={handleFolderSelect}
                      className="h-12 cursor-pointer rounded-xl"
                    />
                  </div>

                  {files && (
                    <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                      <p className="text-sm font-medium text-foreground">Folder ready for scan</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {files.length} valid files selected after removing ignored folders such as `node_modules`,
                        `.git`, and build output.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleFolderGenerate}
                    disabled={!files || isGenerating}
                    className="h-12 w-full rounded-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning Folder...
                      </>
                    ) : (
                      <>
                        <FolderUp className="mr-2 h-4 w-4" />
                        Generate From Folder
                      </>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="repo" className="mt-5">
                <motion.div
                  key="repo-panel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="rounded-[1.75rem] border border-border/60 bg-background/70 p-6">
                    <p className="text-sm font-medium">Paste a public GitHub repository URL</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Example: `https://github.com/owner/repo`
                    </p>
                    <Input
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="mt-4 h-12 rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleRepoGenerate}
                    disabled={isGenerating}
                    className="h-12 w-full rounded-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning Repository...
                      </>
                    ) : (
                      <>
                        <Github className="mr-2 h-4 w-4" />
                        Generate From Repo Link
                      </>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="user" className="mt-5">
                <motion.div
                  key="user-panel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="rounded-[1.75rem] border border-border/60 bg-background/70 p-6">
                    <p className="text-sm font-medium">Paste a public GitHub username</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Readify will scan public repositories and draft a portfolio-style README.
                    </p>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="github-username"
                      className="mt-4 h-12 rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleUserGenerate}
                    disabled={isGenerating}
                    className="h-12 w-full rounded-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning Profile...
                      </>
                    ) : (
                      <>
                        <UserRound className="mr-2 h-4 w-4" />
                        Generate From GitHub User
                      </>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-[1.75rem] border border-border/60 bg-background/75 p-6"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Modes</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-sm font-medium">📁 Local folder</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Best when the code is already on your machine and you want structure-aware generation.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-sm font-medium">🔗 GitHub repo URL</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pulls public repo metadata and file structure directly from GitHub.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-sm font-medium">👤 GitHub username</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scans public repositories and drafts a stronger profile or portfolio README.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-primary/12 via-transparent to-transparent p-6"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Professional Output</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Modern markdown structure with stronger section rhythm and more attractive formatting.</li>
                <li>Emoji-enhanced headings and cleaner setup instructions when relevant.</li>
                <li>A direct handoff into the editor so you can refine before export.</li>
              </ul>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
