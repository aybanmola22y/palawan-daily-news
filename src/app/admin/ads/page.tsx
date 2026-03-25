import Link from "next/link";
export const dynamic = "force-dynamic";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
    PlusCircle, Megaphone
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getAds } from "@/lib/ads-service";
import AdsTableClient from "@/components/admin/AdsTableClient";

export default async function AdminAdsPage() {
    let user = null;
    try {
        user = await getSession();
    } catch {
        // DB not ready, use demo mode
    }

    const ads = await getAds();
    const demoUser = user || { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar user={demoUser as { name: string; email: string; role: string }} />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Manage Advertisements</h1>
                        <p className="text-sm text-gray-500">Control promotional banners across the website</p>
                    </div>
                    <Link
                        href="/admin/ads/new"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        New Advertisement
                    </Link>
                </div>

                <div className="p-8">
                    <AdsTableClient initialAds={ads} />

                    <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                        <div className="bg-blue-100 p-3 rounded-full h-fit">
                            <Megaphone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">How Ad Management works</h3>
                            <p className="text-blue-800 text-sm leading-relaxed max-w-2xl">
                                When you activate an advertisement and upload an image, it will automatically replace the placeholder blocks on your website.
                                You can set up distinct images for different placements like the homepage billboard or sidebar.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
