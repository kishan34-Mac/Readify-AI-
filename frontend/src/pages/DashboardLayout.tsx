import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout() {
  return (
    <div className="app-shell min-h-screen">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <AppSidebar />
        <div className="panel flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden lg:min-h-0">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        </div>
      </div>
    </div>
  );
}
