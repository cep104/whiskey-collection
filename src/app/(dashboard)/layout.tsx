import { BottomNav } from "@/components/ui/bottom-nav";
import { SidebarNav } from "@/components/ui/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SidebarNav />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
