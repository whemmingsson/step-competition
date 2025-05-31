import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

import { DisplayNameBadge } from "./DisplayNameBadge";
import supabase from "@/supabase";

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "User", path: "/user" },
    { name: "Team", path: "/team" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  async function handleLogout(): Promise<void> {
    const { error } = await supabase().auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile menu button */}
        <div className="flex justify-between items-center md:hidden">
          <span className="text-lg font-bold">Step Competition</span>
          <div className="flex items-center gap-2">
            {/* Logout button for mobile */}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-foreground/80 hover:text-foreground"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden",
            mobileMenuOpen ? "block pt-4 pb-2 space-y-2" : "hidden"
          )}
        >
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block w-full text-center py-3 px-4 rounded-md",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                {item.name} {item.name === "User" && <DisplayNameBadge />}
              </Link>
            );
          })}
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex justify-center space-x-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-base font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 gap-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80"
                )}
              >
                {item.name}
                {item.name === "User" && <DisplayNameBadge />}
              </Link>
            );
          })}

          <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
