"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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


      {/* Main header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* Left: Logo */}
            <div className="flex-1 flex items-center justify-start">
              <Link href="/" className="flex flex-col items-center justify-center shrink-0 pt-1 pb-1">
                <div className="text-[7px] font-medium tracking-[0.15em] text-gray-500 uppercase pb-0.5 sm:text-[8px]">
                  Trusted, Fair & Balanced Reporting
                </div>
                <div className="font-playfair font-black text-2xl sm:text-3xl leading-none tracking-tight">
                  <span className="text-gray-900">Palawan</span>
                  <span className="text-[#f36f21]">Daily</span>
                  <span className="text-[#f36f21] text-[10px] align-top ml-0.5 font-bold">TM</span>
                </div>
                <div className="flex items-center w-full gap-1 mt-0.5">
                  <div className="h-[2px] bg-[#f36f21] grow" />
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] text-gray-800 uppercase leading-none">News</span>
                  <div className="h-[2px] bg-[#f36f21] grow" />
                </div>
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {mainNavItems.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : "/"}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}


              <div className="flex items-center">
                <Link
                  href="/about"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-l-md transition-colors"
                >
                  About PDN
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="px-1.5 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-r-md transition-colors border-l border-gray-100"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/about" className="w-full">
                        About PDN (Main)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about/contact-us" className="w-full">
                        Contact Us
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about/ownership-and-funding" className="w-full">
                        Ownership and Funding
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="lg:hidden p-2 text-gray-500 hover:text-red-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <form action="/search" method="get">
                <div className="flex gap-2">
                  <input
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="flex-1 h-10 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  />
                  <Button type="submit" variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                    Search
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 py-3">
              {[...mainNavItems, ...moreCategories].map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : "/"}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="mt-2 pt-2 border-t border-gray-200">
                <div
                  className="w-full flex items-center justify-between px-3 py-1 text-sm font-medium text-gray-700"
                >
                  <Link 
                    href="/about" 
                    className="flex-1 py-1 hover:text-red-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    About PDN
                  </Link>
                  <button
                    type="button"
                    className="p-2 hover:bg-red-50 rounded-md transition-colors"
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    aria-expanded={mobileAboutOpen}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {mobileAboutOpen && (
                  <div className="pl-3">
                    <Link
                      href="/about/contact-us"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileAboutOpen(false);
                      }}
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/about/ownership-and-funding"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
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
