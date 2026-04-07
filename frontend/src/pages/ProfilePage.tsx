import { motion } from "framer-motion";
import { CalendarDays, LogOut, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Account</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Profile & security</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[1.75rem] border border-border/60 bg-card/80 p-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-xl font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <UserCircle2 className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Authenticated workspace</p>
            <p className="mt-1 text-sm text-muted-foreground">Your generated README files are tied to this account.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <Mail className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Email identity</p>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Member since</p>
            <p className="mt-1 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Production-minded auth flow</p>
              <p className="text-sm text-muted-foreground">Passwords are stored hashed in MongoDB and access is token-protected.</p>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          className="mt-8 rounded-full"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </motion.div>
    </div>
  );
}
