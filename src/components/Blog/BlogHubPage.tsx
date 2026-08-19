import React, { useState, useMemo } from "react";
import {
  Search,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  Zap,
  Tag,
  Calendar,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  BlogCategory,
  BlogPost,
} from "../../data/blogData";
import { Breadcrumbs, generateBreadcrumbSchema } from "../SEO/Breadcrumbs";
import { SeoHead } from "../SEO/SeoHead";

interface BlogHubPageProps {
  onNavigatePath: (path: string) => void;
  onSelectCategory?: (category: BlogCategory) => void;
}

export const BlogHubPage: React.FC<BlogHubPageProps> = ({
  onNavigatePath,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [{ label: "Blog", path: "/blog/" }];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  // Filter logic
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHead
        title="TypeBlast Blog - Typing Speed Guides, Practice & Touch Typing Tips"
        description="Comprehensive guides on touch typing, increasing WPM, keyboard switch ergonomics, typing games, and career benchmarks from the TypeBlast Team."
        canonicalUrl="https://www.typeblast.com/blog/"
        structuredData={[
          breadcrumbSchema,
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "TypeBlast Typing Guides & Speed Telemetry Blog",
            description:
              "Expert touch typing strategies, ergonomics, keyboard hardware guides, and speed drills.",
            url: "https://www.typeblast.com/blog/",
            publisher: {
              "@type": "Organization",
              name: "TypeBlast",
              logo: "https://www.typeblast.com/icon.png",
            },
          },
        ]}
      />

      {/* Header & Breadcrumbs */}
      <div className="space-y-3">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigatePath} />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>TypeBlast Guides & Research</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Typing Speed & Touch Typing Blog
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              In-depth touch typing tutorials, ergonomic posture guides, keyboard switch mechanics, and career WPM benchmarks written by touch typing specialists.
            </p>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, keys, WPM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Featured Article Hero (Only show if no search filter) */}
      {!searchQuery && selectedCategory === "All" && featuredPost && (
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider text-[10px]">
                    Featured Guide
                  </span>
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    {featuredPost.category}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <h2
                  onClick={() => onNavigatePath(`/blog/${featuredPost.slug}/`)}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight cursor-pointer hover:text-cyan-400 transition-colors group-hover:translate-x-0.5"
                >
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {featuredPost.publishedDate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigatePath(`/blog/${featuredPost.slug}/`)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.imageAlt || featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Categories</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            All Categories ({BLOG_POSTS.length})
          </button>

          {BLOG_CATEGORIES.map((cat) => {
            const count = BLOG_POSTS.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No guides found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find any articles matching "{searchQuery}". Try adjusting your query or category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigatePath(`/blog/${post.slug}/`)}
              className="group flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/40"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {post.readingTime}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {post.publishedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                  />
                  <span className="text-[11px] font-medium text-slate-300">
                    {post.author.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Action Callout */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Put Learning into Practice</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Ready to test your typing speed & accuracy?
          </h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Take a standard 15s, 30s, or 60s test on TypeBlast with real-time WPM metrics, error diagnostics, and official printable speed certificates.
          </p>
        </div>

        <button
          onClick={() => onNavigatePath("/typing-test/")}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap cursor-pointer hover:scale-105"
        >
          Start Typing Test Now
        </button>
      </div>
    </div>
  );
};
