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
    const user = await getSession();
    const ads = await getAds();

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AdminSidebar user={user as any} />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Manage Advertisements</h1>
                        <p className="text-sm text-muted-foreground">Control promotional banners across the website</p>
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

                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full h-fit">
                            <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-1">How Ad Management works</h3>
                            <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed max-w-2xl">
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
