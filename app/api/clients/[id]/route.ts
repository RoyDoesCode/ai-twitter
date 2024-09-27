import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { convertHoursToCron } from "@/utils/consts";
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

        await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/api/schedules/${params.id}`);

        if (data.active) {
            const doc = await db.doc(params.id).get();
            const { interval, startHour } = doc.data() as Client;
            if (!interval || !startHour) return new NextResponse("Cron not set", { status: 400 });

            const cron = convertHoursToCron(interval, new Date(startHour));
            await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/schedules/${params.id}`, {
                cron,
            });
        }

        return NextResponse.json(res);
    } catch {
        return new NextResponse("[CLIENT_PATCH] Internal Server Error", { status: 500 });
    }
}
