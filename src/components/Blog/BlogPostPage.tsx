import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Tag,
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  ArrowLeft,
  BookOpen,
  User,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  BlogPost,
  getRelatedBlogPosts,
  getBlogPostBySlug,
} from "../../data/blogData";
import { Breadcrumbs, generateBreadcrumbSchema } from "../SEO/Breadcrumbs";
import { SeoHead } from "../SEO/SeoHead";

interface BlogPostPageProps {
  slug: string;
  onNavigatePath: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  onNavigatePath,
}) => {
  const post = getBlogPostBySlug(slug);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested guide or blog post could not be located.
        </p>
        <button
          onClick={() => onNavigatePath("/blog/")}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors cursor-pointer"
        >
          Return to Blog Hub
        </button>
      </div>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post, 3);
  const currentUrl = `https://www.typeblast.com/blog/${post.slug}/`;

  const breadcrumbs = [
    { label: "Blog", path: "/blog/" },
    { label: post.category, path: "/blog/" },
    { label: post.title },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: [post.featuredImage],
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "TypeBlast",
      logo: {
        "@type": "ImageObject",
        url: "https://www.typeblast.com/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareText = encodeURIComponent(`${post.title} via TypeBlast`);
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
    currentUrl
  )}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  const isPillar = post.tags?.includes("Pillar Guide") || post.slug === "improve-typing-speed-guide";

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href) {
        if (href.startsWith("#")) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        } else if (href.startsWith("/") && !href.startsWith("//")) {
          e.preventDefault();
          onNavigatePath(href);
        }
      }
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SeoHead
        title={`${post.title} - TypeBlast Guide`}
        description={post.metaDescription}
        canonicalUrl={currentUrl}
        structuredData={[breadcrumbSchema, articleSchema]}
      />

      {/* Navigation & Breadcrumbs */}
      <div className="space-y-4">
        <button
          onClick={() => onNavigatePath("/blog/")}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Blog Guides</span>
        </button>

        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigatePath} />
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {isPillar ? (
            <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black uppercase tracking-wider text-[10px] shadow-md shadow-cyan-500/20 flex items-center gap-1">
              <span>🌟 Master Pillar Hub</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
              {post.category}
            </span>
          )}
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {post.readingTime}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Published: {post.publishedDate}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full border-2 border-cyan-500/30 object-cover"
            />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{post.author.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Author
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {post.author.role}
              </div>
            </div>
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              Share:
            </span>

            <button
              onClick={handleCopyLink}
              title="Copy Article Link"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer relative"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter/X"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-[420px] shadow-xl">
        <img
          src={post.featuredImage}
          alt={post.imageAlt || post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Article Body */}
      <div 
        onClick={handleContentClick}
        className="prose prose-invert max-w-none space-y-6 text-slate-200 text-sm leading-relaxed antialiased"
      >
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="[&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-slate-800 [&>h2]:pb-2 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-cyan-400 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-slate-300 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-slate-300 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:text-slate-300 [&_a]:text-cyan-400 [&_a]:underline [&_a:hover]:text-cyan-300 [&_code]:text-cyan-300 [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono"
        />
      </div>

      {/* Interactive Call-to-Action Card */}
      <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>Apply This Guide Immediately</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Test your WPM & finger accuracy on TypeBlast
          </h3>
          <p className="text-xs text-slate-400">
            Real-time keystroke precision telemetry, customizable practice drills, and anti-tamper leaderboards.
          </p>
        </div>

        <button
          onClick={() => onNavigatePath("/typing-test/")}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap cursor-pointer hover:scale-105"
        >
          Take Speed Test
        </button>
      </div>

      {/* Tags List */}
      <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-800">
        <Tag className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-400 font-semibold mr-1">Tags:</span>
        {post.tags.map((t, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Author Bio Footer Box */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start gap-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-14 h-14 rounded-full border-2 border-cyan-500/30 object-cover shrink-0"
        />
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-bold text-white">{post.author.name}</h4>
            <div className="text-xs text-cyan-400 font-medium">{post.author.role}</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {post.author.bio}
          </p>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Related Guides & Articles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigatePath(`/blog/${rel.slug}/`)}
                className="group p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer space-y-3"
              >
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={rel.featuredImage}
                    alt={rel.imageAlt || rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-cyan-400">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
