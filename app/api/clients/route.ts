import db from "@/utils/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
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
        const { id, ...fields } = await req.json();

        const response = await db.doc(id).set(fields);

        return NextResponse.json(response);
    } catch {
        return new NextResponse("[CLIENTS_POST] Internal Server Error", { status: 500 });
    }
}
