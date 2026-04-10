"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  tagline?: string;
  subtext?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  forceDark?: boolean;
}

export function BrandLogo({ 
  className, 
  tagline = "Trusted, Fair & Balanced Reporting",
  subtext = "NEWS", 
  size = "md",
  showTagline = false,
  forceDark = false
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-2xl sm:text-3xl",
    md: "text-3xl sm:text-4xl",
    lg: "text-4xl sm:text-5xl",
    xl: "text-5xl sm:text-6xl",
  };

  const tmSizeClasses = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-[12px]",
    xl: "text-[14px]",
  };

  const taglineSizeClasses = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-[13px]",
    xl: "text-[15px]",
  };

  const subtextSizeClasses = {
    sm: "text-[10px]",
    md: "text-[12px]",
    lg: "text-[14px]",
    xl: "text-[16px]",
  };

  const navyColor = forceDark ? "text-white" : "text-[#0a1d37]";
  const orangeColor = "text-[#f36f21]";
  const taglineColor = forceDark ? "text-white/40" : "text-[#6b7280]";
  const newsColor = forceDark ? "text-white/60" : "text-[#6b7280]";

  return (
    <div className={cn("inline-flex flex-col select-none", className)}>
      {/* Top Tagline: Mixed case serif */}
      {showTagline && (
        <div className={cn(
          "font-playfair leading-none mb-0.5 text-center transition-colors duration-300 w-full",
          taglineSizeClasses[size],
          taglineColor
        )}>
          {tagline}
        </div>
      )}

      {/* Main Logo Text: Palawan (Navy) + Daily (Orange) + TM (Orange) */}
      <div className="flex items-start">
        <h1 className={cn(
          "font-playfair font-black leading-none tracking-tight transition-colors duration-300",
          sizeClasses[size]
        )}>
          <span className={navyColor}>Palawan</span>
          <span className={orangeColor}>Daily</span>
        </h1>
        <span className={cn(
          "font-bold leading-none ml-0.5",
          orangeColor,
          tmSizeClasses[size]
        )}>
          TM
        </span>
      </div>

      {/* Bottom element: Orange Line on left, "NEWS" on right */}
      <div className="w-full flex items-center mt-1 gap-2">
        <div className="h-[2px] sm:h-[3px] bg-[#f36f21] flex-1" />
        <span className={cn(
          "font-sans font-bold uppercase tracking-[0.1em] leading-none transition-colors duration-300",
          subtextSizeClasses[size],
          newsColor
        )}>
          {subtext}
        </span>
      </div>
    </div>
  );
}
