import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "User", path: "/user" },
    { name: "Team", path: "/team" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <nav className="bg-background border-b top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center space-x-4">
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
