import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  href?: string;
  color?: string; // kept for API compatibility, no longer used for styling
}

export default function SectionHeader({ title, href }: Props) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-900">
      <h2 className="font-playfair font-black text-base text-gray-900 uppercase tracking-[0.06em] flex items-center gap-2.5">
        <span className="w-[3px] h-[18px] bg-[#f36f21] inline-block shrink-0" />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-[#f36f21] transition-colors"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
