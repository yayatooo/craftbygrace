import type React from "react";

import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getCurrentAuthFn } from "#/features/auth/auth.function";
import { AppSidebar } from "#/pages/_platform/components/app-sidebar";
import { SiteHeader } from "#/pages/_platform/components/site-header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin")({
  beforeLoad: async () => {
    const currentAuth = await getCurrentAuthFn();

    if (!currentAuth?.isOwner) {
      throw redirect({
        to: "/login",
      });
    }

    return {
      user: currentAuth.user,
    };
  },

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
