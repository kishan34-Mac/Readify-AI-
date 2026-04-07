# Readify AI Pro

Readify AI Pro is a full-stack app that lets you upload a project folder and generate a polished `README.md` using Gemini.

## Project Structure

```text
readify-ai-pro-main/
├── backend/   # Express API for upload parsing and Gemini README generation
└── frontend/  # React + Vite dashboard UI
```

## Features

- Upload a local project folder from the browser
- Paste a public GitHub repository URL and generate a README from GitHub metadata
- Paste a GitHub username and generate a profile-style README with repos missing README files called out
- Ignore noisy folders like `node_modules` and `.git`
- Preserve uploaded folder paths so the README can be inferred from real project structure
- Generate a README with Gemini using your `GEMINI_API_KEY`
- Review, edit, copy, and download the generated `README.md`
- Sign up and log in with MongoDB-backed account storage
- Persist generated README files to a personal saved library for future editing

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, Multer, `@google/generative-ai`

## Setup

### 1. Install dependencies

```bash
cd /Users/kishan/Desktop/readify-ai-pro-main/backend && npm install
cd /Users/kishan/Desktop/readify-ai-pro-main/frontend && npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5001
CLIENT_ORIGIN=http://localhost:8080
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Optional: create `frontend/.env` if your backend runs on a different URL:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

## Run the App

Start the backend:

```bash
cd /Users/kishan/Desktop/readify-ai-pro-main/backend
npm run dev
```

Start the frontend:

```bash
cd /Users/kishan/Desktop/readify-ai-pro-main/frontend
npm run dev
```

Open the frontend URL shown by Vite, usually `http://localhost:8080`.

## How to Use

1. Open the Upload page.
2. Select a project folder from your computer.
3. Click `Generate README`.
4. Review the generated Markdown in the editor.
5. Copy or download the final `README.md`.

## API

### `POST /api/generate`

Accepts uploaded files under the `projectFiles` form-data field and returns:

```json
{
  "readme": "# Your generated README..."
}
```

### `POST /api/auth/signup`

Creates a user account and returns a JWT plus the user profile.

### `POST /api/auth/login`

Logs in an existing user and returns a JWT plus the user profile.

### `GET /api/readmes`

Returns the authenticated user's saved README library.

## Deployment

### Frontend on Vercel

- Import the `frontend` directory as the Vercel project root.
- Set `VITE_API_BASE_URL` to your Render backend URL.
- The included [frontend/vercel.json](/Users/kishan/Desktop/readify-ai-pro-main/frontend/vercel.json) handles SPA route rewrites.

### Backend on Render

- Create a new Render Web Service using the `backend` directory.
- Use `npm install` as the build command and `npm start` as the start command.
- Or use the included [render.yaml](/Users/kishan/Desktop/readify-ai-pro-main/render.yaml) for Blueprint deployment.
- Set these environment variables in Render:
  `CLIENT_ORIGIN`
  `GEMINI_API_KEY`
  `GITHUB_TOKEN` (optional)
  `MONGODB_URI`
  `JWT_SECRET`
  `JWT_EXPIRES_IN`

### Production Notes

- Do not commit `backend/.env` or `frontend/.env`.
- Set `CLIENT_ORIGIN` to your Vercel domain, for example `https://your-app.vercel.app`.
- Set `VITE_API_BASE_URL` to your Render backend URL, for example `https://your-api.onrender.com`.

## Notes

- The generated README is inferred mostly from the uploaded file structure, not full source-code analysis.
- A valid Gemini API key must be present in `backend/.env`.
- If the frontend cannot reach the backend, confirm `CLIENT_ORIGIN`, `PORT`, and `VITE_API_BASE_URL`.

## Validation

Verified locally:

- Frontend build: `npm run build`
- Frontend tests: `npm test`
- Frontend lint: `npm run lint` passes when run on its own
- Backend controller loads successfully with the Gemini integration
