import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import db from "@/utils/firestore";
import { Client } from "@/utils/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const doc = await db.doc(params.id).get();

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch {
        return new NextResponse("[CLIENT_GET] Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data: Partial<Client> = await req.json();
        const res = await db.doc(params.id).update(data);

        return NextResponse.json(res);
    } catch {
        return new NextResponse("[CLIENT_PATCH] Internal Server Error", { status: 500 });
    }
}
