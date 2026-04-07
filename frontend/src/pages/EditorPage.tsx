import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";
import { apiRequest } from "@/lib/api";

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const initialReadme = location.state?.generatedReadme || "";
  const initialSavedReadmeId = location.state?.savedReadmeId || "";
  const [readmeContent, setReadmeContent] = useState(initialReadme);
  const [savedReadmeId, setSavedReadmeId] = useState(initialSavedReadmeId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!initialReadme) {
      navigate("/dashboard/upload");
    }
  }, [initialReadme, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      toast({
        title: "Copied to clipboard!",
        description: "You can now paste your README anywhere.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "README.md has been saved to your computer.",
    });
  };

  const handleSave = async () => {
    if (!token) {
      toast({
        title: "Login required",
        description: "Please log in to save README files to your account.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
      const title = (titleMatch?.[1] || "Saved README").trim();

      if (savedReadmeId) {
        const data = await apiRequest<{ readme: { id: string } }>(`/api/readmes/${savedReadmeId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ title, content: readmeContent }),
        });
        setSavedReadmeId(data.readme.id);
      } else {
        const data = await apiRequest<{ readme: { id: string } }>("/api/readmes", {
          method: "POST",
          token,
          body: JSON.stringify({
            title,
            content: readmeContent,
            sourceType: "folder",
            sourceLabel: title,
          }),
        });
        setSavedReadmeId(data.readme.id);
      }

      toast({
        title: "Saved",
        description: "README saved to your library.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save the README.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/upload")}
          className="rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Refine the generated markdown before export
        </div>
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-border/60 bg-card/85 shadow-[0_40px_120px_-80px_hsl(var(--foreground)/0.35)]">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Final Pass</p>
            <CardTitle className="mt-3 font-display text-3xl tracking-tight">Review & Edit README</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleSave} className="rounded-full" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : savedReadmeId ? "Update Saved" : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCopy} className="rounded-full">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button onClick={handleDownload} className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-8 lg:grid-cols-[1fr_280px]">
          <Textarea
            value={readmeContent}
            onChange={(e) => setReadmeContent(e.target.value)}
            className="min-h-[65vh] rounded-[1.5rem] border-border/60 bg-background/80 p-5 font-mono text-sm leading-7"
            placeholder="Your markdown will appear here..."
          />
          <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Editor Tips</p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              <li>Use concise overview text so the project value is obvious in the first screenful.</li>
              <li>Keep installation steps copy-paste friendly for GitHub readers.</li>
              <li>Add badges only when they improve clarity, not just decoration.</li>
              <li>Export once the README feels clear, confident, and ready to hand off.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
