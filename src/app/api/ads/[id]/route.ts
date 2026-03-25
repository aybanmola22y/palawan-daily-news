import { NextResponse } from "next/server";
import { getAdById, updateAd, deleteAd } from "@/lib/ads-service";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ad = await getAdById(id);
    if (!ad) {
        return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }
    return NextResponse.json(ad);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const success = await updateAd(id, body);

        if (!success) {
            return NextResponse.json({ error: "Failed to update ad" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteAd(id);

        if (!success) {
            return NextResponse.json({ error: "Failed to delete ad" }, { status: 400 });
        }

        // Force revalidation
        revalidatePath("/");
        revalidatePath("/admin/ads");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
