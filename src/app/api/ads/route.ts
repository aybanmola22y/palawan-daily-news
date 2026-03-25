import { NextResponse } from "next/server";
import { getAds } from "@/lib/ads-service";

export async function GET() {
    const ads = await getAds();
    return NextResponse.json(ads);
}
