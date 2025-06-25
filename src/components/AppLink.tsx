import { Link, type LinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { useLang } from "@/hooks/useLang";

// Use forwardRef to properly handle ref forwarding
export const AppLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, to, ...rest }, ref) => {
    const lang = useLang();
    return (
      <Link
        ref={ref}
        className={`${className || ""}`}
        to={`/${lang}${to}`} // Prepend the language to the path
        {...rest} // Spread all remaining props to Link
      >
        {children}
      </Link>
    );
  }
);

// Display name for debugging
AppLink.displayName = "AppLink";
