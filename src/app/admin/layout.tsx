import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | PDN Admin",
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  // Strict Protection: Redirect to login if not authenticated
  if (!user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
