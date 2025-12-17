"use client";

import { Footer, Header, MainSidebar, MainSidebarProvider, useSidebar } from "@/components";
import { AuthProvider } from "@/hooks/auth/useAuth";
import clsx from "clsx";

function MainContent({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, collapsed } = useSidebar();

  return (
    <div 
      className={clsx(
        "pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300 flex flex-col",
        // Push content on mobile when sidebar is open
        isMobileOpen ? "ml-72" : "ml-0",
        // Push content on desktop based on sidebar state (fixed sidebar needs margin)
        collapsed ? "lg:ml-[70px]" : "lg:ml-72"
      )}
    >
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
          <MainSidebarProvider>
            <Header />
            <MainSidebar />
            <MainContent>{children}</MainContent>
          </MainSidebarProvider>
        </AuthProvider>
    );
}