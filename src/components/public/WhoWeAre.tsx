"use client";

import { useState } from "react";
import Image from "next/image";
import { Facebook, Users } from "lucide-react";
import type { OrgChartDepartment } from "@/lib/mock-data";
import { mockOrgChartDepartments, mockOrgChartEmployees } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const departments: { slug: OrgChartDepartment | "all"; label: string }[] = [
  { slug: "all", label: "All Departments" },
  ...mockOrgChartDepartments,
];

interface WhoWeAreProps {
  initialAuthors?: any[];
}

export default function WhoWeAre({ initialAuthors = [] }: WhoWeAreProps) {
  const [filter, setFilter] = useState<OrgChartDepartment | "all">("all");

  const authors = initialAuthors.length > 0 ? initialAuthors : mockOrgChartEmployees;

  const filtered =
    filter === "all"
      ? authors
      : authors.filter((e) => e.department === filter);

  return (
    <section className="pt-24 border-t border-slate-100">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-400 mb-2 border border-slate-100">
          <Users className="h-3 w-3" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">The Newsroom</span>
        </div>
        <h2 className="font-playfair text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
          Meet our Journalists
        </h2>
        <p className="mt-4 text-slate-500 max-w-xl mx-auto font-light text-lg leading-relaxed">
          The dedicated professionals behind Palawan Daily News, 
          upholding the highest standards of reporting.
        </p>
      </div>

      {/* Filter: pill tabs with professional styling */}
      <div className="mb-16 flex flex-wrap justify-center gap-2">
        {departments.map((d) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => setFilter(d.slug)}
            className={cn(
               "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 border",
               filter === d.slug
                 ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105"
                 : "bg-white text-slate-500 border-slate-100 hover:border-slate-900 hover:text-slate-900"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Employee cards: clinical modern design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </section>
  );
}

function EmployeeCard({ employee }: { employee: any }) {
  const avatar = employee.avatarUrl || employee.avatar_url;
  return (
    <article className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100/80 shadow-sm transition-all duration-500 hover:border-slate-900/5 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border border-slate-100 group-hover:scale-110 group-hover:border-[#f36f21]/30 transition-all duration-500" />
        <div className="relative w-full h-full rounded-full overflow-hidden p-1.5 grayscale group-hover:grayscale-0 transition-all duration-700">
          {avatar ? (
            <Image
              src={avatar}
              alt={employee.name}
              fill
              className="object-cover rounded-full"
              sizes="96px"
            />
          ) : (
             <Image 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=f36f21&color=fff&bold=true`}
              alt={employee.name}
              fill
              className="object-cover rounded-full"
            />
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-playfair text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#f36f21] transition-colors duration-300">
          {employee.name}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">
          {employee.title}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 w-full flex justify-center">
        {employee.facebookUrl && (
          <a
            href={employee.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-[#1877f2] hover:text-white transition-all duration-300 shadow-sm"
            aria-label={`${employee.name} on Facebook`}
          >
            <Facebook className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Background flourish */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[100%] transition-colors duration-500 group-hover:bg-[#f36f21]/5" />
    </article>
  );
}
