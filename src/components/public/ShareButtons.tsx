"use client";
import { useState } from "react";
import { Facebook, Twitter, Link2, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: "facebook" | "twitter") => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      
      <button 
        onClick={() => handleShare("facebook")}
        className="flex items-center gap-1 px-3 py-1.5 bg-[#1877F2] text-white text-xs font-medium rounded hover:bg-[#166fe5] transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="h-3.5 w-3.5 fill-current" /> Facebook
      </button>

      <button 
        onClick={() => handleShare("twitter")}
        className="flex items-center gap-1 px-3 py-1.5 bg-[#1DA1F2] text-white text-xs font-medium rounded hover:bg-[#1a91da] transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="h-3.5 w-3.5 fill-current" /> Twitter
      </button>

      <button 
        onClick={copyToClipboard}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${
          copied ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
