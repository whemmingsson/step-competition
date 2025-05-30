import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "User", path: "/user" },
    { name: "Team", path: "/team" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile menu button */}
        <div className="flex justify-between items-center md:hidden">
          <span className="text-lg font-bold">Step Competition</span>
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
                {item.name}
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
                  "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
