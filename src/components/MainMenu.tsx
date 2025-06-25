import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Trash, X } from "lucide-react";

import { DisplayNameBadge } from "./DisplayNameBadge";
import supabase from "@/supabase";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { SitePages } from "@/navigation/NavigationConfig";
import { AppLink } from "./AppLink";

export const MainMenu = ({ className }: { className?: string }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function handleLogout(): Promise<void> {
    const { error } = await supabase().auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <nav
      className={
        `bg-background border-b sticky top-0 z-10 ` + (className || "")
      }
    >
      <div>
        {/* Mobile menu button */}
        <div className="flex justify-between items-center md:hidden">
          <span className="text-lg font-bold ml-4">Step Competition</span>
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
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-foreground/80 hover:text-foreground"
              title="Logout"
            >
              <Trash className="h-5 w-5" />
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
        <div
          className={cn(
            "md:hidden absolute left-0 right-0 top-full bg-background border-b shadow-lg z-20",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="container mx-auto px-4 py-2 space-y-2">
            {SitePages.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <AppLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block w-full text-center py-2 px-2 rounded-md",
                    isActive
                      ? "bg-blue-900 text-primary-foreground"
                      : "text-foreground/80"
                  )}
                >
                  {item.name} {item.name === "Profile" && <DisplayNameBadge />}
                </AppLink>
              );
            })}
          </div>
        </div>

        {/* Desktop navigation container */}
        <div className="hidden md:flex w-full items-center justify-between h-12">
          {/* Left section with logo */}
          <div className="w-[150px] lg:w-[200px] flex items-center"></div>

          {/* Center section - menu items */}
          <div className="flex items-center justify-center gap-1 md:gap-2 lg:gap-4">
            {SitePages.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <AppLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 md:px-3 lg:px-3 py-2 text-sm md:text-sm font-medium transition-colors",
                    "hover:bg-blue-900 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 gap-1 lg:gap-2",
                    isActive
                      ? "bg-blue-900 text-primary-foreground"
                      : "text-foreground/80"
                  )}
                >
                  {item.icon}
                  {item.name}
                  {item.name === "Profile" && <DisplayNameBadge />}
                </AppLink>
              );
            })}
          </div>

          {/* Right section - login/delete buttons */}
          <div className="flex items-center space-x-1 md:space-x-2 w-[150px] lg:w-[200px] justify-end mr-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              size="sm"
              className="flex items-center gap-1 md:gap-2"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              size="sm"
              className="flex items-center gap-1 md:gap-2"
            >
              <Trash className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden lg:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How to delete your account</AlertDialogTitle>
            <AlertDialogDescription>
              Don't want to use the app anymore? No worries! Just send us an
              email to{" "}
              <a
                href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
                className="underline"
              >
                {import.meta.env.VITE_CONTACT_EMAIL}
              </a>{" "}
              with your display name and we will delete your account for you.{" "}
              <span className="font-bold">
                Please note that this action is irreversible and will remove all
                your data from our system.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};
