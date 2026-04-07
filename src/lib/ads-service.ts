import fs from "fs";
import path from "path";
import { mockAds, type Advertisement } from "./mock-data";
import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";

function fromSupabase(row: any): Advertisement {
    return {
        id: row.id,
        type: row.type as 'billboard' | 'leaderboard' | 'sidebar' | 'header',
        fit: (row.fit as 'cover' | 'contain') || 'cover',
        imageUrl: row.image_url,
        linkUrl: row.link_url,
        active: row.active,
        label: row.label,
        sublabel: row.sublabel
    };
}

const DATA_FILE = path.join(process.cwd(), "src/data/ads.json");

let cachedAds: Advertisement[] | null = null;
let cachedAdsMtimeMs: number | null = null;

async function ensureAdsFile(): Promise<Advertisement[]> {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Serve from cache if the file hasn't changed.
    try {
        if (fs.existsSync(DATA_FILE)) {
            const mtimeMs = fs.statSync(DATA_FILE).mtimeMs;
            if (cachedAds && cachedAdsMtimeMs === mtimeMs) {
                return cachedAds;
            }
        }
    } catch {
        // ignore cache checks if stat fails
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(mockAds, null, 2), "utf-8");
        try {
            cachedAds = mockAds;
            cachedAdsMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
        } catch {
            // ignore
        }
        return mockAds;
    }

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const existing: Advertisement[] = JSON.parse(data);

    // Merge in any new mock ad slots so Admin dashboard always includes them.
    const existingIds = new Set(existing.map((a) => a.id));
    let merged = existing;
    let updated = false;

    for (const slot of mockAds) {
        if (!existingIds.has(slot.id)) {
            if (merged === existing) merged = [...existing];
            merged.push(slot);
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
    }

    try {
        cachedAds = merged;
        cachedAdsMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {
        // ignore
    }

    return merged;
}

export async function getAds(): Promise<Advertisement[]> {
    if (isSupabaseConfigured) {
        const { data, error } = await supabaseAdmin.from("ads").select("*").order("id");
        if (!error && data) {
            const supabaseAds = data.map(fromSupabase);
            const existingIds = new Set(supabaseAds.map(a => a.id));
            
            // Merge in missing mock slots
            let merged = [...supabaseAds];
            let changed = false;
            for (const mockAd of mockAds) {
                if (!existingIds.has(mockAd.id)) {
                    merged.push(mockAd);
                    changed = true;
                }
            }
            
            // Sort by ID to keep order consistent
            return merged.sort((a, b) => a.id.localeCompare(b.id));
        }
    }

    try {
        return await ensureAdsFile();
    } catch (error) {
        console.error("Error reading ads data:", error);
        return [];
    }
}

export async function saveAds(ads: Advertisement[]): Promise<boolean> {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(ads, null, 2), "utf-8");
        try {
            cachedAds = ads;
            cachedAdsMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
        } catch {
            // ignore
        }
        return true;
    } catch (error) {
        console.error("Error saving ads data:", error);
        return false;
    }
}

export async function getAdById(id: string): Promise<Advertisement | undefined> {
    if (isSupabaseConfigured) {
        const { data, error } = await supabaseAdmin
            .from("ads")
            .select("*")
            .eq("id", id)
            .single();
        if (!error && data) return fromSupabase(data);
    }

    const ads = await getAds();
    return ads.find((ad) => String(ad.id) === String(id));
}

export async function updateAd(id: string, updates: Partial<Advertisement>): Promise<boolean> {
    if (isSupabaseConfigured) {
        const payload: any = {};
        if (updates.type !== undefined) payload.type = updates.type;
        if (updates.fit !== undefined) payload.fit = updates.fit;
        if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
        if (updates.linkUrl !== undefined) payload.link_url = updates.linkUrl;
        if (updates.active !== undefined) payload.active = updates.active;
        if (updates.label !== undefined) payload.label = updates.label;
        if (updates.sublabel !== undefined) payload.sublabel = updates.sublabel;

        const { error } = await supabaseAdmin
            .from("ads")
            .update(payload)
            .eq("id", id);
        
        if (!error) {
            const { revalidatePath } = await import("next/cache");
            revalidatePath("/");
            revalidatePath("/admin/ads");
            return true;
        }
        
        // If it doesn't exist, try to insert it (useful for onboarding new slots)
        if (error.code === 'PGRST116' || error.message.includes('No rows found') || true) {
             const { error: insertError } = await supabaseAdmin
                .from("ads")
                .upsert({ id, ...payload });
             if (!insertError) return true;
        }
        
        console.error("Supabase updateAd error:", error);
        return false;
    }

    const ads = await getAds();
    const index = ads.findIndex((ad) => String(ad.id) === String(id));
    if (index === -1) return false;

    ads[index] = { ...ads[index], ...updates };
    return await saveAds(ads);
}

export async function deleteAd(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
        const { error } = await supabaseAdmin.from("ads").delete().eq("id", id);
        if (!error) return true;
        console.error("Supabase deleteAd error:", error);
        return false;
    }

    const ads = await getAds();
    const filtered = ads.filter((ad) => String(ad.id) !== String(id));
    if (filtered.length === ads.length) return false;
    return await saveAds(filtered);
}
