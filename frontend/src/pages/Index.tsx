import { motion } from "framer-motion";
import { ArrowRight, FilePenLine, FolderTree, MoonStar, Sparkles, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";

const features = [
  {
    title: "Folder-first scanning",
    description: "Readify preserves project structure so generated sections feel more grounded and useful.",
    icon: FolderTree,
  },
  {
    title: "Polished markdown output",
    description: "Generate README files with clearer hierarchy, modern copy, setup instructions, and emoji accents.",
    icon: Sparkles,
  },
  {
    title: "Edit before export",
    description: "Stay in flow with a built-in editor for refining the final document before download.",
    icon: FilePenLine,
  },
];

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="panel flex items-center justify-between rounded-[2rem] px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">Readify AI</p>
              <p className="text-xs text-muted-foreground">Modern README generation studio</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild variant="default" className="rounded-full px-5">
                <Link to="/dashboard/upload">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="default" className="rounded-full px-5">
                  <Link to="/signup">
                    Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-muted-foreground">
                <MoonStar className="h-4 w-4 text-primary" />
                Light and dark mode included
              </div>
              <h1 className="max-w-4xl font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Generate README files that feel ready for the spotlight.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Drag in a full project folder, let AI turn structure into polished documentation, and refine the final
                markdown in a cleaner, modern workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <>
                    <Button asChild size="lg" className="rounded-full px-7">
                      <Link to="/dashboard/upload">
                        Start Generating
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                      <Link to="/dashboard/history">Open Saved Library</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" className="rounded-full px-7">
                      <Link to="/signup">
                        Start Free
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                      <Link to="/login">I already have an account</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="panel rounded-[2.25rem] p-5 shadow-[0_50px_140px_-70px_hsl(var(--foreground)/0.35)]">
                <div className="rounded-[1.75rem] border border-border/60 bg-card/85 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Preview</p>
                      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">A smoother documentation flow</h2>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-sm font-medium">📁 Drop full folder</p>
                      <p className="mt-1 text-sm text-muted-foreground">Keep meaningful structure, ignore noisy build output.</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-sm font-medium">✨ Generate attractive README</p>
                      <p className="mt-1 text-sm text-muted-foreground">Sharper sections, cleaner setup steps, better visual rhythm.</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-sm font-medium">🛠 Refine and export</p>
                      <p className="mt-1 text-sm text-muted-foreground">Edit in the workspace, copy to clipboard, or download instantly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-14 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.4 }}
                className="rounded-[1.75rem] border border-border/60 bg-card/75 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </motion.article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
