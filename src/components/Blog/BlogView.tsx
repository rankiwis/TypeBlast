import React from "react";
import { BlogHubPage } from "./BlogHubPage";
import { BlogPostPage } from "./BlogPostPage";

interface BlogViewProps {
  onNavigatePath?: (path: string) => void;
  slug?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({
  onNavigatePath = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("popstate"));
    }
  },
  slug,
}) => {
  // If slug is provided directly, render the post page
  if (slug) {
    return <BlogPostPage slug={slug} onNavigatePath={onNavigatePath} />;
  }

  // Otherwise check window.location.pathname for /blog/[slug]/
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname.replace(/\/$/, ""); // trim trailing slash
    const parts = pathname.split("/").filter(Boolean); // e.g. ["blog", "how-to-type-100-wpm-touch-typing-guide"]
    if (parts.length >= 2 && parts[0] === "blog") {
      const extractedSlug = parts[1];
      return <BlogPostPage slug={extractedSlug} onNavigatePath={onNavigatePath} />;
    }
  }

  return <BlogHubPage onNavigatePath={onNavigatePath} />;
};
