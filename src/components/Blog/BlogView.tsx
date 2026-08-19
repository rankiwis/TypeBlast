import React from "react";
import { BlogHubPage } from "./BlogHubPage";
import { BlogPostPage } from "./BlogPostPage";

interface BlogViewProps {
  onNavigatePath?: (path: string) => void;
  slug?: string;
  currentPath?: string;
  initialCategory?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({
  onNavigatePath = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("popstate"));
    }
  },
  slug,
  currentPath,
  initialCategory,
}) => {
  // If slug is provided directly, render the post page
  if (slug) {
    return <BlogPostPage slug={slug} onNavigatePath={onNavigatePath} />;
  }

  // Determine path from currentPath prop or window.location.pathname
  const effectivePath = currentPath || (typeof window !== "undefined" ? window.location.pathname : "/blog/");
  const cleanPath = effectivePath.split("?")[0].replace(/\/$/, "");
  const parts = cleanPath.split("/").filter(Boolean); // e.g. ["blog", "good-typing-speed-wpm-benchmarks"]

  if (parts.length >= 2 && parts[0] === "blog") {
    const extractedSlug = parts[1];
    return <BlogPostPage slug={extractedSlug} onNavigatePath={onNavigatePath} />;
  }

  return <BlogHubPage onNavigatePath={onNavigatePath} initialCategory={initialCategory} />;
};

