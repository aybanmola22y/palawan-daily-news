"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/admin/BrandLogo";

const mainNavItems = [
  { name: "Home", slug: "" },
  { name: "Latest News", slug: "all" },
  { name: "Advertise", slug: "advertise" },
  { name: "Opinion", slug: "opinion" },
  { name: "Legal Section", slug: "legal" },
  { name: "Lifestyle", slug: "lifestyle" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<{name: string, slug: string}[]>([]);

  useEffect(() => {
    fetch(`/api/categories?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDynamicCategories(data.map(c => ({ name: c.name, slug: c.slug })));
        }
      })
      .catch(console.error);
  }, []);

  const topSlugs = mainNavItems.map(i => i.slug).filter(Boolean);
  const moreCategories = dynamicCategories.filter(c => !topSlugs.includes(c.slug));

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-20">
            {/* Left: Logo */}
            <div className="flex-1 flex items-center justify-start">
              <Link href="/" className="group transition-transform hover:scale-[1.02] duration-300">
                <BrandLogo size="sm" subtext="News" className="items-start" showTagline={true} />
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {mainNavItems.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : "/"}
                  className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}

              <div className="flex items-center ml-2 border-l border-slate-100 pl-4">
                <Link
                  href="/about"
                  className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-950 hover:text-[#f36f21] transition-colors"
                >
                  About PDN
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-[#f36f21] transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-100 shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/about" className="w-full text-xs font-bold py-2.5 rounded-lg px-3 hover:bg-slate-50 transition-colors">
                        About PDN (Main)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about/contact-us" className="w-full text-xs font-bold py-2.5 rounded-lg px-3 hover:bg-slate-50 transition-colors">
                        Contact Us
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about/ownership-and-funding" className="w-full text-xs font-bold py-2.5 rounded-lg px-3 hover:bg-slate-50 transition-colors">
                        Ownership and Funding
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-full transition-all duration-300"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-slate-950"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-6 animate-in slide-in-from-top duration-300">
              <form action="/search" method="get">
                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for articles, news, or topics..."
                    className="flex-1 h-12 px-6 bg-transparent text-sm focus:outline-none"
                    autoFocus
                  />
                  <Button type="submit" variant="default" className="bg-slate-950 hover:bg-[#f36f21] rounded-xl h-12 px-8 transition-colors">
                    Search
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-slate-100 py-6 space-y-1 animate-in slide-in-from-top duration-300">
              {[...mainNavItems, ...moreCategories].map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : "/"}
                  className="block px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div
                  className="w-full flex items-center justify-between px-4 py-2"
                >
                  <Link 
                    href="/about" 
                    className="flex-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950 hover:text-[#f36f21] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    About PDN
                  </Link>
                  <button
                    type="button"
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    aria-expanded={mobileAboutOpen}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {mobileAboutOpen && (
                  <div className="pl-4 mt-2 space-y-1">
                    <Link
                      href="/about/contact-us"
                      className="block px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileAboutOpen(false);
                      }}
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/about/ownership-and-funding"
                      className="block px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileAboutOpen(false);
                      }}
                    >
                      Ownership and Funding
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
