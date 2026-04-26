# 🏏 SFMD

A dynamic and visually engaging web portfolio or tribute site, likely dedicated to a cricketer, showcasing their biography, achievements, statistics, and a rich media gallery. Built with a modern frontend stack, SFMD offers an interactive experience to explore a player's career and impact.

[![Primary Language: TypeScript](https://img.shields.io/badge/Primary_Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Built With: React](https://img.shields.io/badge/Built_With-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Styled With: Tailwind CSS](https://img.shields.io/badge/Styled_With-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Package Manager: Bun](https://img.shields.io/badge/Package_Manager-Bun-FBF0E4?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![Test Runner: Vitest](https://img.shields.io/badge/Test_Runner-Vitest-6E9549?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![E2E Testing: Playwright](https://img.shields.io/badge/E2E_Testing-Playwright-2EAD5C?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

---

## 📝 Table of Contents

*   [✨ Overview](#-overview)
*   [🚀 Features](#-features)
*   [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
*   [📁 Project Structure](#-project-structure)
*   [⚙️ Installation](#%EF%B8%8F-installation)
*   [💡 Usage](#-usage)
*   [👋 Notes](#-notes)

---

## ✨ Overview

SFMD (Samad's Fictional/Football/Fantastic/Fastest/Finest/etc. Moments/Dreams/Days/Dedications) is a modern, responsive single-page application crafted to present a compelling narrative, likely for a sports personality—specifically, a cricketer, given the wealth of cricket-related imagery. The site effectively uses interactive components and a clean UI to highlight key career aspects, personal journey, and visual media. It provides a rich browsing experience for fans and followers.

*(Note: The full project name "SFMD" is inferred; the project's content heavily suggests a personal portfolio or tribute site.)*

---

## 🚀 Features

Based on the visible file structure and components, SFMD appears to offer the following features:

*   **Hero Section**: An engaging introductory section with prominent imagery (`HeroSection`).
*   **About Section**: Detailed information about the subject (`AboutSection`).
*   **Biography Section**: A dedicated area for a personal biography or life story (`BiographySection`).
*   **Achievements Section**: Highlights key milestones and successes (`AchievementsSection`).
*   **Stats Section**: Displays career statistics and metrics, possibly with animated counters (`StatsSection`, `AnimatedCounter`).
*   **Gallery Section**: A rich collection of images and media, likely utilizing carousels for display (`GallerySection`, `carousel` component).
*   **Blog Section**: Features blog posts or articles related to the subject (`BlogSection`).
*   **Contact Section**: Provides means for interaction or reaching out (`ContactSection`).
*   **Responsive Navigation**: A sticky and responsive navbar for seamless navigation across devices (`Navbar`, `NavLink`).
*   **Loading Animations**: Smooth transitions or loading indicators for enhanced user experience (`LoadingAnimation`).
*   **Modern UI Components**: Utilizes a comprehensive set of accessible and customizable UI components (`src/components/ui/` including `button`, `card`, `dialog`, `accordion`, `pagination`, etc.).
*   **Scroll Reveal Effects**: Dynamic elements that animate into view as the user scrolls (`useScrollReveal`).

---

## 🛠️ Tech Stack

SFMD is built with a robust and modern set of technologies for a high-performance and maintainable web application:

*   **Frontend Framework**: [React](https://react.dev/) – For building interactive user interfaces.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) – Provides type safety and enhances code quality.
*   **Build Tool**: [Vite](https://vitejs.dev/) – A fast and efficient build tool for modern web projects.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) – A utility-first CSS framework for rapid UI development.
*   **UI Library**: [Shadcn/ui](https://ui.shadcn.com/) – A collection of reusable components built with Radix UI and Tailwind CSS.
*   **Package Manager**: [Bun](https://bun.sh/) – A fast, all-in-one JavaScript runtime and toolkit.
*   **Unit Testing**: [Vitest](https://vitest.dev/) – A fast unit test framework powered by Vite.
*   **End-to-End Testing**: [Playwright](https://playwright.dev/) – For robust browser automation and E2E testing.
*   **Linting**: [ESLint](https://eslint.org/) – For maintaining code consistency and quality.
*   **Code Formatting**: [PostCSS](https://postcss.org/) – For transforming CSS with JavaScript plugins.

---

## 📁 Project Structure

The repository is organized into a logical structure to promote maintainability and clarity:

```
SFMD/
├── public/                 # Public assets (e.g., index.html)
├── src/                    # Source code for the application
│   ├── assets/             # Images and other static media files (e.g., cricket-related images, portraits)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Shadcn/ui components (e.g., button, card, dialog)
│   │   └── (core components) # Application-specific components (e.g., HeroSection, Navbar)
│   ├── hooks/              # Custom React hooks (e.g., useScrollReveal)
│   ├── lib/                # Utility functions
│   ├── pages/              # Top-level page components (e.g., Index.tsx, NotFound.tsx)
│   ├── test/               # Test files for Vitest
│   ├── App.css             # Main application CSS
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global CSS styles
│   ├── main.tsx            # Entry point of the React application
│   └── vite-env.d.ts       # Vite environment type definitions
├── bun.lockb               # Bun lockfile
├── components.json         # Shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Project dependencies and scripts
├── playwright.config.ts    # Playwright E2E testing configuration
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── vitest.config.ts        # Vitest testing configuration
```

---

## ⚙️ Installation

To set up SFMD locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anshumeshsaini/SFMD.git
    cd SFMD
    ```

2.  **Install dependencies:**
    This project uses `bun` as the package manager. If you don't have Bun installed, you can find instructions on their [official website](https://bun.sh/docs/installation).
    ```bash
    bun install
    ```

---

## 💡 Usage

Once the dependencies are installed, you can run the development server or build the project:

1.  **Run the development server:**
    This will start a local development server, typically accessible at `http://localhost:5173`.
    ```bash
    bun dev
    ```

2.  **Build the project for production:**
    This will compile the project into static files in the `dist` directory, ready for deployment.
    ```bash
    bun run build
    ```

3.  **Run tests:**
    Execute the unit tests using Vitest.
    ```bash
    bun test
    ```

4.  **Run E2E tests (Playwright):**
    First, ensure you have built the project or are running the dev server, then run Playwright tests.
    ```bash
    bun run test-e2e
    ```

---

## 👋 Notes

*   This project is inferred to be a personal portfolio or tribute site, primarily based on the asset names and component structure.
*   The `SFMD` acronym's full meaning is not explicitly provided in the repository metadata but is consistent with a personal project.
*   The `src/components/ui` directory suggests the use of [shadcn/ui](https://ui.shadcn.com/) for its comprehensive set of customizable and accessible UI components.
