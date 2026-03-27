"use client";
import React from "react";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/lib/mock-data";

interface BannerAdProps {
  ad?: Advertisement;
  className?: string;
}

export default function BannerAd({ ad, className }: BannerAdProps) {
  const isActive = ad?.active;
  const displayLabel = ad?.label || "Be a certified safety officer";
  const displaySublabel = ad?.sublabel || "Attend our online and face-to-face training.";
  const displayImageUrl = ad?.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop";
  const displayLinkUrl = ad?.linkUrl || "https://www.petrosphere.com.ph";

  const content = (
    <div className={cn("w-full overflow-hidden rounded-lg shadow-sm border border-gray-100", className)}>
      <div className="flex h-[100px] sm:h-[120px] w-full bg-white text-left">
        {/* Left Image Section */}
        <div className="relative w-1/3 sm:w-1/4 h-full shrink-0 overflow-hidden">
          <img
            src={displayImageUrl}
            alt={displayLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
        </div>

        {/* Center Yellow Text Section */}
        <div className="flex-1 bg-[#ffb800] flex flex-col justify-center px-4 sm:px-8 relative">
          <h2 className="text-gray-900 font-bold text-base sm:text-2xl leading-tight tracking-tight">
            {displayLabel}
          </h2>
          <p className="text-gray-800 text-[10px] sm:text-sm mt-1 font-medium">
            {displaySublabel}
          </p>
          <div className="text-gray-900 text-[9px] sm:text-xs font-bold mt-1">
            {ad?.linkUrl && !isActive ? displayLinkUrl : (
                <span className="opacity-70">Official PDN Partner</span>
            )}
          </div>
          
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Right Logo Section */}
        <div className="w-24 sm:w-48 bg-white flex flex-col items-center justify-center p-2 sm:p-4 shrink-0 border-l border-gray-50">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Minimal SVG Logo Placeholder */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-12 sm:h-12 text-[#ffb800] mb-1">
              <path 
                fill="currentColor" 
                d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C75 95 95 75 95 50 C95 25 75 5 50 5 Z M50 85 C30.7 85 15 69.3 15 50 C15 30.7 30.7 15 50 15 C69.3 15 85 30.7 85 50 C85 69.3 69.3 85 50 85 Z" 
              />
              <path 
                fill="currentColor" 
                d="M50 25 L50 75 M25 50 L75 50" 
                stroke="currentColor" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              <circle cx="50" cy="50" r="15" fill="currentColor" />
            </svg>
            <span className="text-[8px] sm:text-[10px] font-black tracking-tighter text-gray-400 uppercase leading-none">
                Palawan Daily
              <span className="text-[6px] align-top ml-0.5">TM</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isActive && displayLinkUrl) {
    return (
      <a href={displayLinkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return content;
}
