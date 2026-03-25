"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ExternalLink, Edit, Trash2, 
    CheckCircle2, XCircle, Layout,
    Search, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface AdsTableClientProps {
    initialAds: Advertisement[];
}

export default function AdsTableClient({ initialAds }: AdsTableClientProps) {
    const router = useRouter();
    const [ads, setAds] = useState(initialAds);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredAds = ads.filter(ad => 
        ad.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleStatus = async (ad: Advertisement) => {
        setLoadingId(ad.id);
        try {
            const res = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !ad.active }),
            });

            if (res.ok) {
                setAds(ads.map(a => a.id === ad.id ? { ...a, active: !a.active } : a));
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to toggle ad status", error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ad slot?")) return;
        
        setDeletingId(id);
        try {
            const res = await fetch(`/api/ads/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAds(ads.filter(a => a.id !== id));
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to delete ad", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search ads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Placement</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAds.map((ad) => (
                                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 text-sm">{ad.label}</div>
                                        <div className="text-xs text-gray-500">{ad.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                            <Layout className="h-3 w-3" />
                                            {ad.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ad.imageUrl ? (
                                            <div className="w-20 h-10 rounded border border-gray-200 overflow-hidden relative self-center">
                                                <img src={ad.imageUrl} alt={ad.label} className="object-cover w-full h-full" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No image uploaded</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => toggleStatus(ad)}
                                            disabled={loadingId === ad.id}
                                            className={cn(
                                                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all hover:shadow-sm",
                                                ad.active 
                                                    ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" 
                                                    : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200",
                                                loadingId === ad.id && "opacity-50 cursor-wait"
                                            )}
                                        >
                                            {loadingId === ad.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : ad.active ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <XCircle className="h-3 w-3" />
                                            )}
                                            {ad.active ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/ads/${ad.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            
                                            <a 
                                                href={ad.linkUrl || "#"} 
                                                target={ad.linkUrl ? "_blank" : undefined}
                                                rel="noopener noreferrer" 
                                                className={cn(
                                                    "transition-colors",
                                                    ad.linkUrl ? "text-gray-400 hover:text-gray-600" : "text-gray-200 cursor-not-allowed"
                                                )}
                                                onClick={(e) => !ad.linkUrl && e.preventDefault()}
                                                title={ad.linkUrl ? "Open link" : "No link set"}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                            
                                            <button 
                                                onClick={() => handleDelete(ad.id)}
                                                disabled={deletingId === ad.id}
                                                className={cn(
                                                    "text-gray-400 hover:text-red-600 transition-colors",
                                                    deletingId === ad.id && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {deletingId === ad.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
