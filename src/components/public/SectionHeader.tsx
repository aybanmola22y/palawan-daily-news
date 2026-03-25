import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  href?: string;
  color?: string;
}

export default function SectionHeader({ title, href, color = "red" }: Props) {
  // Mapping of category colors to Tailwind background classes
  const bgClasses: Record<string, string> = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    green: "bg-emerald-600",
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    slate: "bg-slate-700",
    gray: "bg-gray-600",
    amber: "bg-amber-600",
    pink: "bg-pink-600",
    sky: "bg-sky-600",
    orange: "bg-orange-500",
    teal: "bg-teal-600",
  };

  const bgColor = bgClasses[color] || "bg-red-600";

  return (
    <div className="relative mb-6 flex items-center group">
      <div className={`${bgColor} text-white px-4 py-2 text-sm font-bold uppercase tracking-widest leading-none relative z-10 shadow-sm whitespace-nowrap`}>
        {title}
        {/* Decorative notch */}
        <div className={`absolute top-0 -right-2 w-0 h-0 border-t-[32px] border-t-transparent border-l-[8px] border-l-current ${bgColor.replace('bg-', 'text-')}`} style={{ borderTopWidth: '34px', borderLeftWidth: '10px' }}></div>
      </div>
      <div className={`flex-1 h-[2px] ${bgColor} opacity-20`} />
      
      {href && (
        <Link 
          href={href} 
          className="ml-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
