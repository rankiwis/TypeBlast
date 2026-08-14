import React from "react";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const handleClick = (e: React.MouseEvent, path?: string) => {
    e.preventDefault();
    if (path && onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="my-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <li className="flex items-center gap-1">
          <a
            href="/"
            onClick={(e) => handleClick(e, "/")}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors font-medium"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </a>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-200" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => handleClick(e, item.path)}
                  className="hover:text-cyan-400 transition-colors font-medium"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to build Schema.org BreadcrumbList JSON-LD
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl = "https://www.typeblast.com") {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${baseUrl}/`,
    },
    ...items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: item.label,
      item: item.path ? `${baseUrl}${item.path}` : `${baseUrl}/`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
