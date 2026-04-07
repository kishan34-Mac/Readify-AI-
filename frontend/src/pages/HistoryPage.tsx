import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, FileText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { apiRequest } from "@/lib/api";
import { useNavigate } from "react-router-dom";

type SavedReadme = {
  id: string;
  title: string;
  sourceType: string;
  sourceLabel: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function HistoryPage() {
  const { token } = useAuth();
  const [readmes, setReadmes] = useState<SavedReadme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadReadmes = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest<{ readmes: SavedReadme[] }>("/api/readmes", {
        token,
      });
      setReadmes(data.readmes);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadReadmes();
  }, [loadReadmes]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Saved Library</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Your persistent README history</h2>
        </div>
        <Button variant="outline" className="rounded-full" onClick={loadReadmes}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="panel rounded-[1.75rem] p-8 text-sm text-muted-foreground">Loading saved README files...</div>
      ) : readmes.length === 0 ? (
        <div className="panel rounded-[1.75rem] p-8 text-sm text-muted-foreground">
          No saved README files yet. Generate one from the upload studio and it will appear here automatically.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {readmes.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[1.75rem] border border-border/60 bg-card/80 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.sourceLabel}</p>
                </div>
                <div className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.sourceType}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Updated {new Date(item.updatedAt).toLocaleString()}
              </div>

              <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {item.content}
              </p>

              <Button
                className="mt-5 rounded-full"
                onClick={() =>
                  navigate("/dashboard/editor", {
                    state: { generatedReadme: item.content, savedReadmeId: item.id },
                  })
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                Open in Editor
              </Button>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
