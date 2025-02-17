import axios from "axios";
import { firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

import db from "@/utils/firestore";
import { Client } from "@/utils/types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { cron } = await req.json();

        const { data } = await axios.post(
            "https://api.mergent.co/v2/schedules",
            {
                name: params.id,
                request: {
                    url: `${process.env.NEXT_PUBLIC_HOST}/api/tweet/${params.id}`,
                },
                cron,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        await db.doc(params.id).update({ scheduleId: data.id });

        return NextResponse.json(data);
    } catch {
        return new NextResponse("[SCHEDULE_POST] Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const doc = await db.doc(params.id).get();
        const { scheduleId } = doc.data() as Client;
        if (!scheduleId)
            return NextResponse.json({ message: "No schedule exists for this client." });

        const response = await axios.delete(`https://api.mergent.co/v2/schedules/${scheduleId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
            },
        });

        await db.doc(params.id).update({ scheduleId: firestore.FieldValue.delete() });

        return NextResponse.json(response.data);
    } catch {
        return new NextResponse("[SCHEDULE_DELETE] Internal Server Error", { status: 500 });
    }
}
