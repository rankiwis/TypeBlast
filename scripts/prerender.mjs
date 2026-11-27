import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(String(key)) ? store.get(String(key)) : null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(String(key));
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
  };
}

if (typeof globalThis.localStorage === "undefined") {
  globalThis.localStorage = createMemoryStorage();
}
if (typeof globalThis.sessionStorage === "undefined") {
  globalThis.sessionStorage = createMemoryStorage();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTemplateHeadTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']robots["'][^>]*>\s*/gi, "")
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']og:(?:title|description|url|type|site_name|image(?::width|:height)?)["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']twitter:(?:card|title|description|image)["'][^>]*>\s*/gi, "");
}

function injectAfterViewport(template, tagsHtml) {
  const viewportRegex = /(<meta\s+[^>]*name=["']viewport["'][^>]*>)/i;
  if (!viewportRegex.test(template)) {
    throw new Error("Could not find <meta name=\"viewport\"> in dist/index.html");
  }
  return template.replace(viewportRegex, `$1\n    ${tagsHtml}`);
}

async function main() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, "dist");
  const entryPath = path.join(rootDir, "dist-ssr", "entry-server.js");

  const { render } = await import(pathToFileURL(entryPath).href);

  const rawTemplate = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  const cleanTemplate = stripTemplateHeadTags(rawTemplate);

  // Build app-shell.html fallback (noindex, no canonical)
  const appShellTags = [
    "<title>TypeBlast</title>",
    '<meta name="robots" content="noindex" />',
  ].join("\n    ");
  const appShellHtml = injectAfterViewport(cleanTemplate, appShellTags);
  fs.writeFileSync(path.join(distDir, "app-shell.html"), appShellHtml, "utf-8");

  // Parse routes from dist/sitemap.xml
  const sitemapXml = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf-8");
  const locMatches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gi)];
  const routes = Array.from(
    new Set(
      locMatches.map((match) => {
        const pathname = new URL(match[1].trim()).pathname;
        return pathname.length > 1 && !pathname.endsWith("/") ? `${pathname}/` : pathname;
      })
    )
  );

  for (const routePath of routes) {
    const { html, head } = render(routePath);
    if (!head) {
      throw new Error(`Missing SeoHead metadata during prerender for route: ${routePath}`);
    }

    const isBlogArticle = /^\/blog\/[^/]+\/?$/.test(routePath);
    const robotsValue = head.noIndex ? "noindex, nofollow" : "index, follow";
    const ogType = isBlogArticle ? "article" : "website";
    const ogImage = "https://www.typeblast.com/og-image.png";

    const headLines = [
      `<title>${escapeHtml(head.title)}</title>`,
      `<meta name="description" content="${escapeHtml(head.description)}" />`,
      `<meta name="robots" content="${robotsValue}" />`,
      `<link rel="canonical" href="${escapeHtml(head.canonicalUrl)}" />`,
      `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(head.canonicalUrl)}" />`,
      `<meta property="og:type" content="${ogType}" />`,
      `<meta property="og:site_name" content="TypeBlast" />`,
      `<meta property="og:image" content="${ogImage}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(head.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(head.description)}" />`,
      `<meta name="twitter:image" content="${ogImage}" />`,
    ];

    if (Array.isArray(head.structuredData) && head.structuredData.length > 0) {
      for (const schemaItem of head.structuredData) {
        const json = JSON.stringify(schemaItem).replace(/</g, "\\u003c");
        headLines.push(`<script type="application/ld+json" data-seo="json-ld">${json}</script>`);
      }
    }

    let pageHtml = injectAfterViewport(cleanTemplate, headLines.join("\n    "));
    const rootPlaceholder = '<div id="root"></div>';
    if (!pageHtml.includes(rootPlaceholder)) {
      throw new Error(`Could not find ${rootPlaceholder} in template while rendering ${routePath}`);
    }
    pageHtml = pageHtml.replace(rootPlaceholder, () => `<div id="root">${html}</div>`);

    const trimmedRoute = routePath.replace(/^\/+|\/+$/g, "");
    const outFile = trimmedRoute
      ? path.join(distDir, trimmedRoute, "index.html")
      : path.join(distDir, "index.html");

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, pageHtml, "utf-8");
  }

  // Render 404 page to dist/404.html with noindex and no canonical
  const { html: notFoundHtml, head: notFoundHead } = render("/404-not-found/");
  const notFoundTitle = notFoundHead?.title || "Page Not Found | TypeBlast";
  const notFoundDescription =
    notFoundHead?.description ||
    "The page you're looking for doesn't exist or may have moved.";
  const notFoundTags = [
    `<title>${escapeHtml(notFoundTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(notFoundDescription)}" />`,
    '<meta name="robots" content="noindex" />',
  ].join("\n    ");
  let notFoundPageHtml = injectAfterViewport(cleanTemplate, notFoundTags);
  const rootPlaceholder = '<div id="root"></div>';
  if (!notFoundPageHtml.includes(rootPlaceholder)) {
    throw new Error("Could not find <div id=\"root\"></div> in template while rendering 404.html");
  }
  notFoundPageHtml = notFoundPageHtml.replace(rootPlaceholder, () => `<div id="root">${notFoundHtml}</div>`);
  fs.writeFileSync(path.join(distDir, "404.html"), notFoundPageHtml, "utf-8");

  console.log(`Prerendered ${routes.length} routes successfully (+ 404.html).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
