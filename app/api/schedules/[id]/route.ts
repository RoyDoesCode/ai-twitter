import parser from "cron-parser";
import { firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/firestore";
import inngest from "@/lib/inngest";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { cron } = await req.json();

        // compute next fire time (UTC)
        const it = parser.parse(cron, { tz: "UTC" });
        const next = it.next().getTime(); // ms epoch

        // persist cron for future reschedules
        await db.doc(params.id).set({ cron }, { merge: true });

        // send a “tweet scheduled” event with ts = next run
        await inngest.send({
            name: "tweet/scheduled",
            data: { clientId: params.id, cron },
            ts: next, // Inngest will run the function at this time
        });

        // you can still keep a field if your UI expects it
        await db.doc(params.id).set({ scheduleId: params.id }, { merge: true });

        return NextResponse.json({ ok: true, nextRunAt: new Date(next).toISOString() });
    } catch (e) {
        return new NextResponse("[SCHEDULE_POST] Internal Server Error", { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const doc = await db.doc(params.id).get();
        if (!doc.exists || !doc.data()?.cron) {
            return NextResponse.json({ message: "No schedule exists for this client." });
        }

        // trigger cancellation via event
        await inngest.send({
            name: "tweet/cancelled",
            data: { clientId: params.id },
        });

        await db.doc(params.id).update({
            cron: firestore.FieldValue.delete(),
            scheduleId: firestore.FieldValue.delete(),
        });

        return NextResponse.json({ ok: true });
    } catch {
        return new NextResponse("[SCHEDULE_DELETE] Internal Server Error", { status: 500 });
    }
}
