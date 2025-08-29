"use client";

import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-purple rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="font-bold text-2xl gradient-text">Listing Launch</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}