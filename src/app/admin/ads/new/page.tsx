"use client";
import { useState, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import {
    Megaphone, Save, ArrowLeft, Image as ImageIcon,
    Link as LinkIcon, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAdPage() {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ad, setAd] = useState({
        label: "",
        sublabel: "",
        type: "billboard",
        fit: "contain",
        imageUrl: "",
        linkUrl: "",
        active: true
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/uploads", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setAd({ ...ad, imageUrl: data.url });
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            router.push("/admin/ads");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <AdminSidebar user={{ name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" }} />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/ads" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">New Advertisement Slot</h1>
                            <p className="text-sm text-gray-500">Create a new promotional placement</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        Create Slot
                    </button>
                </div>

                <div className="p-8 max-w-4xl mx-auto">
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="h-5 w-5" />
                            Ad slot created successfully! Returning...
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Placement Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Homepage Billboard"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 font-inter">Ad Type</label>
                                    <select
                                        value={ad.type}
                                        onChange={(e) => setAd({ ...ad, type: e.target.value as any })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                    >
                                        <option value="billboard">Billboard (Wide & Short)</option>
                                        <option value="leaderboard">Leaderboard (Large Rectangular)</option>
                                        <option value="sidebar">Sidebar (Square/Tall)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 font-inter">Image Display Mode</label>
                                    <select
                                        value={ad.fit}
                                        onChange={(e) => setAd({ ...ad, fit: e.target.value as any })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                    >
                                        <option value="cover">Fill Space (Crop to fit)</option>
                                        <option value="contain">Show Full Image (Fit without cropping)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-gray-400" /> Image URL (Optional)
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/banner.jpg"
                                        value={ad.imageUrl}
                                        onChange={(e) => setAd({ ...ad, imageUrl: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className={cn(
                                            "px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors",
                                            uploading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {uploading ? "Uploading..." : "Upload from Computer"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-gray-400" /> Destination URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://business-site.com"
                                    value={ad.linkUrl}
                                    onChange={(e) => setAd({ ...ad, linkUrl: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-4">Ad Slot Preview</h3>
                            <div
                                className={cn(
                                    "bg-white rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 overflow-hidden relative shadow-inner",
                                    ad.fit === "contain" && "bg-white"
                                )}
                                style={{ height: ad.type === "billboard" ? "250px" : (ad.type === "leaderboard" ? "400px" : "600px") }}
                            >
                                {ad.imageUrl ? (
                                    <img src={ad.imageUrl} alt="Preview" className={cn("w-full h-full", ad.fit === "contain" ? "object-contain" : "object-cover")} />
                                ) : (
                                    <>
                                        <Megaphone className="h-6 w-6 text-gray-300 mb-2" />
                                        <p className="text-xs font-bold text-gray-400 uppercase">{ad.label || 'AD SPACE'}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{ad.sublabel}</p>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] text-red-400 mt-3 italic">* This preview shows how the ad appears in its designated slot size ({ad.type}).</p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
