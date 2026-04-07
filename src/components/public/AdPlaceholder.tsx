import React from "react";
import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";
import type { Advertisement } from "@/lib/mock-data";

interface AdPlaceholderProps {
    ad?: Advertisement;
    width?: string;
    height?: string;
    className?: string;
    label?: string;
    sublabel?: string;
}

export function AdPlaceholder({
    ad,
    width = "100%",
    height = "250px",
    className,
    label,
    sublabel
}: AdPlaceholderProps) {
    const displayLabel = ad?.label || label || "ADVERTISEMENT SPACE";
    const displaySublabel = ad?.sublabel || sublabel;
    
    // If ad is explicitly provided and inactive, hide it.
    if (ad && !ad.active) return null;
    
    const isActive = ad?.active && ad?.imageUrl;

    const content = (
        <div
            className={cn(
                "bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center text-center p-6 overflow-hidden relative transition-all duration-300",
                isActive && "border-none bg-white shadow-sm p-0",
                className
            )}
            style={{ width, height }}
        >
            {isActive ? (
                <img
                    src={ad.imageUrl}
                    alt={ad.label}
                    className={cn(
                        "block w-full h-full transition-transform hover:scale-[1.01]",
                        ad.fit === "contain" ? "object-contain bg-white" : "object-cover"
                    )}
                />
            ) : (
                <>
                    <Megaphone className="h-8 w-8 text-gray-300 mb-3" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{displayLabel}</p>
                    {displaySublabel && (
                        <p className="text-xs text-gray-400 mt-2">{displaySublabel}</p>
                    )}
                </>
            )}
        </div>
    );

    if (isActive && ad.linkUrl) {
        return (
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                {content}
            </a>
        );
    }

    return content;
}
