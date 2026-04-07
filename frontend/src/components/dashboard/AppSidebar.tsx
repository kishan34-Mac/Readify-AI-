import { LayoutDashboard, Upload, FileText, Sparkles, Library, UserCircle2 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload", url: "/dashboard/upload", icon: Upload },
  { title: "Editor", url: "/dashboard/editor", icon: FileText },
  { title: "Library", url: "/dashboard/history", icon: Library },
  { title: "Account", url: "/dashboard/profile", icon: UserCircle2 },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="panel flex w-full flex-col overflow-hidden lg:min-h-screen lg:w-72">
      <div className="border-b border-border/60 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.8)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">Readify AI</p>
            <p className="text-xs text-muted-foreground">README studio for serious shipping</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/18 via-primary/5 to-transparent p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-background/80">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="font-medium">Sharper project handoff</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate elegant README files from real folder structure, then refine and export.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-secondary/70 hover:text-foreground"
              activeClassName="bg-secondary text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.6)]"
            >
              <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span>{item.title}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto h-2 w-2 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="rounded-3xl border border-border/60 bg-background/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Focused Workflow</p>
          <p className="mt-2 text-sm text-foreground">
            Upload a project, generate a polished README, edit the copy, and download it in one flow.
          </p>
        </div>
      </div>
    </aside>
  );
}
