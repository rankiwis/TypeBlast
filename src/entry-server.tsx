import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { SeoHeadProps } from "./components/SEO/SeoHead";

export function render(url: string): { html: string; head: SeoHeadProps | null } {
  // Reset per-route SSR head holder before rendering
  const ssrGlobal = globalThis as { __SEO_HEAD__?: SeoHeadProps | null };
  ssrGlobal.__SEO_HEAD__ = null;

  const html = renderToString(<App initialPath={url} />);
  const head = ssrGlobal.__SEO_HEAD__ ?? null;

  return { html, head };
}
