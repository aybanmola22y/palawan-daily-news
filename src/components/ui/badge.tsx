import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        red: "border-transparent bg-red-600 text-white hover:bg-red-700",
        blue: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        green: "border-transparent bg-green-600 text-white hover:bg-green-700",
        orange: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        purple: "border-transparent bg-purple-600 text-white hover:bg-purple-700",
        emerald: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        unified: "border-gray-900 bg-white text-[#003399] hover:bg-gray-50 uppercase tracking-wide",
        // Soft category variants
        "cat-red": "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 uppercase tracking-wider text-[10px]",
        "cat-blue": "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 uppercase tracking-wider text-[10px]",
        "cat-emerald": "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 uppercase tracking-wider text-[10px]",
        "cat-orange": "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 uppercase tracking-wider text-[10px]",
        "cat-slate": "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 uppercase tracking-wider text-[10px]",
        "cat-sky": "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 uppercase tracking-wider text-[10px]",
        "cat-pink": "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 uppercase tracking-wider text-[10px]",
        "cat-indigo": "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 uppercase tracking-wider text-[10px]",
        "cat-purple": "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 uppercase tracking-wider text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
