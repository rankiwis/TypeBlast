import React, { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  noIndex?: boolean;
  structuredData?: object[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalUrl,
  noIndex = false,
  structuredData = [],
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Meta Description
    setMetaTag('meta[name="description"]', "name", "description", description);

    // 3. Robots meta (noindex for private pages/dashboards, index for public pages)
    setMetaTag('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    // 4. Open Graph Metadata
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "TypeBlast");

    // 5. Twitter Card Metadata
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // 7. Structured Data (JSON-LD)
    const existingJsonLd = document.querySelectorAll('script[data-seo="json-ld"]');
    existingJsonLd.forEach((el) => el.remove());

    if (structuredData && structuredData.length > 0) {
      structuredData.forEach((data) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "json-ld");
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scriptElements = document.querySelectorAll('script[data-seo="json-ld"]');
      scriptElements.forEach((el) => el.remove());
    };
  }, [title, description, canonicalUrl, noIndex, structuredData]);

  return null;
};

