import { motion } from "framer-motion";
import { ArrowRight, Bot, FolderTree, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const capabilities = [
  {
    title: "Folder-aware generation",
    description: "Upload entire codebases and keep relative structure so the generated README feels grounded.",
    icon: FolderTree,
  },
  {
    title: "Professional output",
    description: "Create attractive markdown from folders, repo links, or GitHub usernames with cleaner hierarchy and stronger copy.",
    icon: Sparkles,
  },
  {
    title: "Fast editing loop",
    description: "Review, polish, copy, and export the final README from one focused interface.",
    icon: Wand2,
  },
];

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]"
      >
        <div className="rounded-[2rem] border border-border/60 bg-card/85 p-8 shadow-[0_40px_100px_-60px_hsl(var(--foreground)/0.25)]">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Modern README workflow</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn raw project folders into launch-ready documentation.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Readify helps you transform source structure into crisp, high-quality README files with a cleaner
            visual style, smarter sections, and a faster editing handoff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="default" size="lg" className="rounded-full px-7" onClick={() => navigate("/dashboard/upload")}>
              Start With Folder Upload
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-7" onClick={() => navigate("/dashboard/editor")}>
              Open Editor
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6">
          <div className="rounded-[1.75rem] border border-border/60 bg-background/80 p-6">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">What the new flow focuses on</h3>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li>Upload a whole folder with drag-and-drop or picker-based directory selection.</li>
              <li>Paste a public GitHub repo URL and generate a README without cloning locally.</li>
              <li>Scan a GitHub username to draft a profile-style README from public repositories.</li>
            </ul>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        {capabilities.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="rounded-[1.75rem] border border-border/60 bg-card/80 p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="rounded-[2rem] border border-border/60 bg-card/80 p-7"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Recommended Flow</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">Upload, generate, refine, export.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              We removed the filler pages and dummy dashboard stats so the product now centers on the actual
              documentation workflow.
            </p>
          </div>
          <Button variant="default" size="lg" className="rounded-full px-7" onClick={() => navigate("/dashboard/upload")}>
            Continue To Upload
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
