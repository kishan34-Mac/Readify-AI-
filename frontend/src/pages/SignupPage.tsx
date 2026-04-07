import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      toast({ title: "Account created", description: "Your workspace is ready." });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Could not create the account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="overflow-hidden rounded-[2rem] border-border/60 bg-card/85">
          <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <UserPlus className="h-5 w-5" />
            </div>
            <CardTitle className="mt-4 font-display text-3xl tracking-tight">Create your account</CardTitle>
            <CardDescription className="mt-2">
              Save generated README files and reuse them later from your personal workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="h-12 rounded-xl" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="h-12 rounded-xl" />
              <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" type="password" className="h-12 rounded-xl" />
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full">
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
            </form>
            <p className="mt-5 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
