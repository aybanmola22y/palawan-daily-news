import fs from "fs";
import path from "path";
import { mockAds, type Advertisement } from "./mock-data";

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
    const ads = await getAds();
    return ads.find((ad) => String(ad.id) === String(id));
}

export async function updateAd(id: string, updates: Partial<Advertisement>): Promise<boolean> {
    const ads = await getAds();
    const index = ads.findIndex((ad) => String(ad.id) === String(id));
    if (index === -1) return false;

    ads[index] = { ...ads[index], ...updates };
    return await saveAds(ads);
}

export async function deleteAd(id: string): Promise<boolean> {
    const ads = await getAds();
    const filtered = ads.filter((ad) => String(ad.id) !== String(id));
    if (filtered.length === ads.length) return false;
    return await saveAds(filtered);
}
