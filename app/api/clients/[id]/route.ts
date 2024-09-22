import db from "@/utils/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const doc = await db.doc(params.id).get();

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch {
        return new NextResponse("[CLIENT_GET] Internal Server Error", { status: 500 });
    }
}
