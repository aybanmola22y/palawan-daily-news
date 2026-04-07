"use client";

import { useState } from "react";
import Image from "next/image";
import { Facebook, Users } from "lucide-react";
import type { OrgChartDepartment, OrgChartEmployee } from "@/lib/mock-data";
import { mockOrgChartDepartments, mockOrgChartEmployees } from "@/lib/mock-data";

const departments: { slug: OrgChartDepartment | "all"; label: string }[] = [
  { slug: "all", label: "All" },
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
    <section className="mt-16 pt-16 border-t border-gray-200/80">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-red-600 mb-3">
          <Users className="h-4 w-4" />
          Meet the team
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Who we are
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          The people behind Palawan Daily News — dedicated to trusted, fair and balanced reporting.
        </p>
      </div>

      {/* Filter: pill tabs with horizontal scroll on mobile */}
      <div className="mb-10 -mx-4 sm:mx-0 overflow-x-auto px-4 sm:px-0">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center pb-2">
          {departments.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setFilter(d.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === d.slug
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Employee cards: elevated card design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
    <article className="group flex gap-5 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
        {avatar ? (
          <Image
            src={avatar}
            alt={employee.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:text-[#f36f21] transition-colors relative overflow-hidden">
            <Image 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&color=fff`}
              alt={employee.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#f36f21] transition-colors">
          {employee.name}
        </h3>
        <p className="text-sm text-gray-600 mt-0.5 leading-snug">{employee.title}</p>
        {employee.facebookUrl && (
          <a
            href={employee.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-gray-500 hover:text-[#1877f2] transition-colors"
            aria-label={`${employee.name} on Facebook`}
          >
            <Facebook className="h-4 w-4" />
            Profile
          </a>
        )}
      </div>
    </article>
  );
}
