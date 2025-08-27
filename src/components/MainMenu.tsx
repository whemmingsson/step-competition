import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CornerUpRight, LogOut, Menu, Trash, X } from "lucide-react";

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
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { LocalStorageService } from "@/services/LocalStorageService";

interface DesktopMenuProps {
  handleLogout: () => Promise<void>;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setLeaveDialogOpen: (open: boolean) => void;
}

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface MobileMenuButtonsProps {
  handleLogout: () => Promise<void>;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setLeaveDialogOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
}

const AppName = () => {
  const navigate = useNavigate();
  return (
    <span
      className="whitespace-nowrap text-orange-600 cursor-pointer font-bold"
      onClick={() => navigate("/")}
    >
      <span className="righteous">Stride</span>
      <span className="orbitron">CHAMP</span>
    </span>
  );
};

// Fixed DesktopMenu component
const DesktopMenu = ({
  handleLogout,
  setIsDeleteDialogOpen,
  setLeaveDialogOpen,
}: DesktopMenuProps) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex w-full items-center justify-between h-12 max-w-full overflow-hidden">
      {/* Logo - more compact on smaller screens */}
      <div className="flex-shrink-1 md:min-w-[120px] xl:min-w-[160px] flex items-center text-lg md:text-xl lg:text-2xl xl:text-3xl pl-1 md:pl-2  overflow-hidden">
        <AppName />
      </div>

      {/* Center navigation - more compact */}
      <div className="flex flex-1 items-center justify-center h-full px-1">
        {SitePages.filter((page) => !page.hideFromMenu).map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ height: "calc(100%)" }}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap md:px-1.5 lg:px-2 xl:px-4 text-xs md:text-sm font-medium transition-colors",
                "hover:bg-gray-200 focus-visible:outline-none gap-0.5 md:gap-1 border-b-3 border-transparent border-t-3 border-t-transparent",
                isActive ? "border-b-3 border-b-blue-950" : "text-foreground/80"
              )}
            >
              {item.icon}
              <span className="hidden md:inline">{item.name}</span>
              {item.name === "Profile" && <DisplayNameBadge />}
            </Link>
          );
        })}
      </div>

      {/* Right buttons - more compact */}
      <div className="flex-shrink-0 flex items-center space-x-1 justify-end pr-1 md:pr-2">
        <Button
          variant="outline"
          onClick={handleLogout}
          size="sm"
          className="flex items-center p-1 md:p-1.5"
        >
          <LogOut className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden lg:inline ml-1">Logout</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setLeaveDialogOpen(true)}
          size="sm"
          className="flex items-center p-1 md:p-1.5"
        >
          <CornerUpRight className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden lg:inline ml-1">Leave</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(true)}
          size="sm"
          className="flex items-center p-1 md:p-1.5"
        >
          <Trash className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden lg:inline ml-1">Delete</span>
        </Button>
      </div>
    </div>
  );
};

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen }: MobileMenuProps) => {
  const location = useLocation();
  return (
    <div
      className={cn(
        "md:hidden absolute left-0 right-0 top-full bg-background border-b shadow-lg z-20",
        mobileMenuOpen ? "block" : "hidden"
      )}
    >
      <div className="container mx-auto px-4 py-2 space-y-2">
        {SitePages.filter((page) => !page.hideFromMenu).map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                " w-full text-center py-2 px-2 flex gap-2 items.center justify-center text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-primary-foreground"
                  : "text-foreground/80"
              )}
            >
              {item.icon} {item.name}{" "}
              {item.name === "Profile" && <DisplayNameBadge />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const MobileMenuButtons = ({
  setMobileMenuOpen,
  handleLogout,
  setIsDeleteDialogOpen,
  setLeaveDialogOpen,
  mobileMenuOpen,
}: MobileMenuButtonsProps) => {
  return (
    <div className="flex justify-between items-center md:hidden">
      <span className="text-2xl font-bold ml-4">
        <AppName />
      </span>
      <div className="flex items-center gap-2">
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
          onClick={() => setLeaveDialogOpen(true)}
          className="text-foreground/80 hover:text-foreground"
          title="Logout"
        >
          <CornerUpRight className="h-5 w-5" />
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
  );
};

export const MainMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setLeaveDialogOpen] = useState(false);

  async function handleLogout(): Promise<void> {
    const { error } = await supabase().auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.href = "/";
    }
  }

  async function handleLeave() {
    LocalStorageService.clear();
    await supabase().auth.signOut();
  }

  return (
    <nav className={`bg-background sticky top-0 z-10 `}>
      <div>
        <MobileMenuButtons
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setLeaveDialogOpen={setLeaveDialogOpen}
        />

        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <DesktopMenu
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setLeaveDialogOpen={setLeaveDialogOpen}
          handleLogout={handleLogout}
        />
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
              with your email you used to register/login, and we will delete
              your account for you.{" "}
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

      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the current competition</AlertDialogTitle>
            <AlertDialogDescription>
              Don't want to participate in the competition any more, but still
              want to keep your data? No problems - click Confirm below.
              <br />
              <span className="font-bold">
                You will be logged out from the app and you will no longer
                participate in the competition. If you want to rejoin later you
                need the original invite link. <br />
                <br />
                Please note that this will NOT remove any data from the
                platform.
              </span>
              <br />
              <br />
              If you instead want to clear all your data from our platform,
              please send an email to{" "}
              <a
                href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
                className="underline"
              >
                {import.meta.env.VITE_CONTACT_EMAIL}
              </a>{" "}
              with your email and we will delete your account for you. <br />
              <span className="font-bold">
                Please note that deleting your data is an irreversible option.
              </span>
              <br />
              <br />
              <span className="italic">
                Removing the data for the current compteition only is currently
                not possible
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nevermind</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};
