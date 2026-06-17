import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { AppSidebar } from "#/pages/_platform/components/app-sidebar";
import { SiteHeader } from "#/pages/_platform/components/site-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <section className="p-6">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
