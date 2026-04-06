"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeAgo, truncate, cn } from "@/lib/utils";
import type { MockArticle } from "@/lib/mock-data";
import { useState } from "react";

interface ArticleCardProps {
  article: MockArticle;
  variant?: "default" | "horizontal" | "featured" | "compact";
  className?: string;
}

const DEFAULT_AUTHOR_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

// Per-category fallback images — all are high-quality landscape Unsplash photos
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "city-news":       "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=420&fit=crop",
  "provincial-news": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=420&fit=crop",
  "regional-news":   "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=420&fit=crop",
  "national-news":   "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=420&fit=crop",
  "national":        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=420&fit=crop",
  "international":   "https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&h=420&fit=crop",
  "environment":     "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=420&fit=crop",
  "sports":          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=420&fit=crop",
  "business":        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=420&fit=crop",
  "lifestyle":       "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=420&fit=crop",
  "column":          "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=420&fit=crop",
  "opinion":         "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&h=420&fit=crop",
  "feature":         "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=420&fit=crop",
  "legal-section":   "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=420&fit=crop",
  "technology":      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=420&fit=crop",
};
const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=420&fit=crop";

function getFallbackImage(categorySlug?: string): string {
  if (categorySlug && CATEGORY_FALLBACK_IMAGES[categorySlug]) {
    return CATEGORY_FALLBACK_IMAGES[categorySlug];
  }
  return DEFAULT_ARTICLE_IMAGE;
}


const CATEGORY_VARIANT_MAP: Record<string, any> = {
  "city-news": "cat-emerald",
  "provincial-news": "cat-blue",
  "regional-news": "cat-orange",
  "national": "cat-slate",
  "international": "cat-sky",
  "youth-campus": "cat-pink",
  "editorial": "cat-indigo",
  "opinion": "cat-red",
  "technology": "cat-blue",
  "business": "cat-emerald",
  "sports": "cat-orange",
  "environment": "cat-emerald",
  "column": "cat-amber",
  "politics": "cat-red",
  "tourism": "cat-purple",
  "lifestyle": "cat-pink",
  "advertise": "cat-slate",
  "legal-section": "cat-slate",
};

export default function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const fallback = getFallbackImage(article?.categorySlug);
  const [imgSrc, setImgSrc] = useState(article?.featuredImage || fallback);

  if (!article) return null;

  if (variant === "featured") {
    return (
      <div className="relative overflow-hidden rounded-xl group bg-gray-900">
        <div className="relative aspect-[4/3] md:aspect-[2/1] lg:aspect-[2.5/1] w-full">
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            onError={() => setImgSrc(fallback)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            {article.breaking && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                BREAKING
              </span>
            )}
            <Badge variant={CATEGORY_VARIANT_MAP[article.categorySlug] || "unified"}>
              {article.categoryName}
            </Badge>
          </div>
          <Link href={`/news/${article.slug}`}>
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 hover:text-red-300 transition-colors leading-tight">
              {article.title}
            </h2>
          </Link>
          <p className="text-gray-300 mb-4 max-w-2xl hidden md:block">
            {truncate(article.excerpt, 180)}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="relative h-6 w-6 rounded-full overflow-hidden">
                <Image 
                  src={article.authorAvatar || DEFAULT_AUTHOR_AVATAR} 
                  alt={article.authorName} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <span>{article.authorName}</span>
            </div>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {timeAgo(article.publishedAt)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 group">
        <div className="relative flex-shrink-0 w-40 sm:w-44 aspect-[16/9] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            className="flex-shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(fallback)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant={CATEGORY_VARIANT_MAP[article.categorySlug] || "unified"} className="text-[10px] mb-2">
            {article.categoryName}
          </Badge>
          <Link href={`/news/${article.slug}`}>
            <h4 className="font-playfair font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors leading-tight line-clamp-2 mb-2">
              {article.title}
            </h4>
          </Link>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo(article.publishedAt)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0 group">
        <span className="text-2xl font-bold text-red-100 leading-none flex-shrink-0 w-8">
          {String(1).padStart(2, "0")}
        </span>
        <div>
          <Link href={`/news/${article.slug}`}>
            <h4 className="font-playfair font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h4>
          </Link>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Eye className="h-3 w-3" /> {article.views.toLocaleString()} views
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col", className)}>
      <div className="relative aspect-[1200/630] w-full overflow-hidden flex-shrink-0 bg-gray-50 border-b border-gray-100">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(fallback)}
        />
        {article.breaking && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">BREAKING</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={CATEGORY_VARIANT_MAP[article.categorySlug] || "unified"} className="text-[10px]">
            {article.categoryName}
          </Badge>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo(article.publishedAt)}
          </span>
        </div>
        <div className="flex-grow">
          <Link href={`/news/${article.slug}`}>
            <h3 className="font-playfair font-bold text-gray-900 hover:text-red-600 transition-colors leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem]">
            {article.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span className="font-medium">{article.authorName}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
