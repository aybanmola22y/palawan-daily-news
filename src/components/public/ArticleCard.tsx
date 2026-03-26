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

const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop";

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
  "politics": "cat-red",
  "tourism": "cat-purple",
  "lifestyle": "cat-pink",
  "advertise": "cat-slate",
  "legal-section": "cat-slate",
};

export default function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const [imgSrc, setImgSrc] = useState(article?.featuredImage || DEFAULT_ARTICLE_IMAGE);

  if (!article) return null;

  if (variant === "featured") {
    return (
      <div className="relative overflow-hidden rounded-xl group">
        <div className="relative h-[500px] w-full">
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            onError={() => setImgSrc(DEFAULT_ARTICLE_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
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
                <Image src={article.authorAvatar} alt={article.authorName} fill className="object-cover" />
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
        <div className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden">
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(DEFAULT_ARTICLE_IMAGE)}
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
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(DEFAULT_ARTICLE_IMAGE)}
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
