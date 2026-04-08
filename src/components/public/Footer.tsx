import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand - logo matches header */}
          <div>
            <Link href="/" className="inline-flex flex-col items-start mb-4">
              <div className="text-[7px] font-medium tracking-[0.15em] text-gray-500 uppercase pb-0.5">
                Trusted and Fair Quad Media Network in MIMAROPA
              </div>
              <div className="font-playfair font-black text-xl sm:text-2xl leading-none tracking-tight">
                <span className="text-white">Palawan</span>
                <span className="text-[#f36f21]">Daily</span>
                <span className="text-[#f36f21] text-[9px] align-top ml-0.5 font-bold">TM</span>
              </div>
              <div className="flex items-center w-full gap-1 mt-0.5">
                <div className="h-[2px] bg-[#f36f21] grow min-w-[4px]" />
                <span className="text-[7px] font-bold tracking-[0.2em] text-gray-300 uppercase leading-none">News</span>
                <div className="h-[2px] bg-[#f36f21] grow min-w-[4px]" />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Palawan Daily News is a quad media publishing company owned and published by Alpha Eight Publishing, a registered company in the Philippines through its Department of Trade Industry and the Bureau of Internal Revenue.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Sections</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Latest News", href: "/category/all" },
                { name: "Advertise", href: "/category/advertise" },
                { name: "Opinion", href: "/category/opinion" },
                { name: "Legal Section", href: "/category/legal" },
                { name: "Lifestyle", href: "/category/lifestyle" },
                { name: "About PDN", href: "/about/contact-us" }
              ].map((section) => (
                <li key={section.name}>
                  <Link
                    href={section.href}
                    className="text-sm hover:text-red-400 transition-colors"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">About</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "#" },
                { name: "Editorial Policy", href: "#" },
                { name: "Contact Us", href: "#" },
                { name: "Advertise With Us", href: "#" },
                { name: "Careers", href: "https://petrosphere.hrpartner.io/jobs" },
                { name: "Privacy Policy", href: "#" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-red-400 transition-colors"
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest Palawan news delivered to your inbox every morning.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Palawan Daily News. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/admin/login" className="hover:text-gray-300 font-semibold">Admin</Link>
            <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
