import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export function DashboardTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const titleMap: Record<string, { title: string; description: string }> = {
    "/dashboard": {
      title: "Workspace",
      description: "A modern flow for README creation, refinement, and delivery.",
    },
    "/dashboard/upload": {
      title: "Upload Studio",
      description: "Drop a folder, inspect structure-aware files, and generate a polished README.",
    },
    "/dashboard/editor": {
      title: "README Editor",
      description: "Refine the generated markdown, copy it, or export it immediately.",
    },
    "/dashboard/history": {
      title: "Saved Library",
      description: "Your persistent collection of generated README files.",
    },
    "/dashboard/profile": {
      title: "Account",
      description: "Manage your profile and keep your saved README workflow secure.",
    },
  };

  const meta = titleMap[location.pathname] ?? titleMap["/dashboard"];

  return (
    <header className="flex flex-col gap-4 border-b border-border/60 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Readify Workspace</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <Button variant="outline" className="rounded-full px-4" onClick={() => navigate("/dashboard/profile")}>
            {user.name.split(" ")[0]}
          </Button>
        )}
        <Button variant="default" className="rounded-full px-5" onClick={() => navigate("/dashboard/upload")}>
          <Wand2 className="h-4 w-4" />
          New README
        </Button>
        <Button variant="ghost" className="rounded-full px-4" onClick={() => { logout(); navigate("/login"); }}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
