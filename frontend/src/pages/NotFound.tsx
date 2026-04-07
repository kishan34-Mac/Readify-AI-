import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="panel max-w-xl rounded-[2rem] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">This page drifted out of the workspace.</h1>
        <p className="mt-4 text-muted-foreground">
          The route <span className="font-medium text-foreground">{location.pathname}</span> does not exist anymore.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link to="/dashboard/upload">Open Upload Studio</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/">Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
