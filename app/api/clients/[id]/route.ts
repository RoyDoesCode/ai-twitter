import { NextRequest, NextResponse } from "next/server";

import db from "@/utils/firestore";
import { Client } from "@/utils/types";
import axios from "axios";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
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
        const doc = (await db.doc(params.id).get()).data();

        if (doc?.active) {
            if (!doc.cron) return new NextResponse("Cron not set.", { status: 400 });

            await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/schedules/${params.id}`, {
                cron: doc.cron,
            });
        } else {
            await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/api/schedules/${params.id}`);
        }

        return NextResponse.json(res);
    } catch {
        return new NextResponse("[CLIENT_PATCH] Internal Server Error", { status: 500 });
    }
}
