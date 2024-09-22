import db from "@/utils/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { docs } = await db.get();
        const clients = docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(clients);
    } catch {
        return new NextResponse("[CLIENTS_GET] Internal Server Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { id, name, industry, woeid, prompt } = await req.json();

        const response = await db.doc(id).set({ name, industry, woeid: parseInt(woeid), prompt });

        return NextResponse.json(response);
    } catch {
        return new NextResponse("[CLIENTS_POST] Internal Server Error", { status: 500 });
    }
}
