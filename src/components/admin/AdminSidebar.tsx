"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Tag, FolderOpen, Users,
  LogOut, Menu, X, ChevronRight, Settings, PlusCircle, Megaphone
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "All Articles", href: "/admin/articles", icon: FileText },
  { label: "New Article", href: "/admin/articles/new", icon: PlusCircle },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Advertisements", href: "/admin/ads", icon: Megaphone },
  { label: "Tags", href: "/admin/tags", icon: Tag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface Props {
  user?: { name: string; email: string; role: string } | null;
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    // Check if there's a more specific (longer) match in the navigation
    const hasMoreSpecificMatch = nav.some(item =>
      item.href !== href &&
      item.href.length > href.length &&
      pathname.startsWith(item.href)
    );
    if (hasMoreSpecificMatch) return false;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="relative flex items-center p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex-1 text-center">
            <div className="leading-none inline-block">
              <div className="font-playfair font-black text-lg tracking-tight">
                <span className="text-foreground">Palawan</span>
                <span className="text-primary italic">Daily</span>
                <span className="text-primary text-[10px] align-top ml-0.5 font-bold">TM</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                  Admin CMS
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-4 p-1 hover:bg-sidebar-accent rounded hidden lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(href)
              ? "bg-red-600 text-white shadow-sm font-bold"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="p-3 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2 mb-2 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/10 text-white">
                  <span className="text-xs font-bold font-mono">{user.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize font-mono">{user.role.replace("_", " ")}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium group"
          >
            <LogOut className="h-4 w-4 shrink-0 group-hover:rotate-12 transition-transform" />
            {!collapsed && <span className="uppercase tracking-widest text-[10px] font-bold">Sign Out</span>}
          </button>
        </div>
      )}
      {/* Branding */}
      {!collapsed && (
        <div className="mt-auto p-4 text-center border-t border-sidebar-border/50">
          <p className="text-xs text-muted-foreground/60 font-medium tracking-tight">
            Developed by <span className="text-foreground font-bold">PetroCore</span><span className="text-red-500 font-bold">X</span>
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 z-50 transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-200 ${collapsed ? "w-16" : "w-64"} shrink-0`}>
        <SidebarContent />
      </div>
    </>
  );
}
