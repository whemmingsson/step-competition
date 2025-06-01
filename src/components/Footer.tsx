import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("py-4 px-4 text-center text-sm", className)}>
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-foreground/70">
        <a
          href="https://github.com/whemmingsson/step-competition"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Github size={16} />
          <span>GitHub Repository</span>
        </a>
        <span className="hidden md:inline">•</span>
        <span>
          Powered by{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Supabase
          </a>
        </span>
        <span className="hidden md:inline">•</span>
        <span>
          Desktop Photo by{" "}
          <a href="https://unsplash.com/@naassomz1?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            N. Azevedo
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/photos/people-running-on-grassfield-under-blue-skies-at-daytime-AcWC8WuCQ_k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Unsplash
          </a>
        </span>
        <span className="hidden md:inline">•</span>
        <span>
          Mobile Photo by{" "}
          <a href="https://unsplash.com/@davegoudreau?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            D. Goudreau
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/photos/person-in-black-pants-and-white-sneakers-walking-on-brown-asphalt-road-during-daytime-1z9ziLqz6lI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Unsplash
          </a>
        </span>
        <span className="hidden md:inline">•</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};
