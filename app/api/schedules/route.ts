import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id, cron } = await req.json();

        const response = await axios.post(
            "https://api.mergent.co/v2/schedules",
            {
                name: id,
                request: {
                    url: `${process.env.NEXT_PUBLIC_HOST}/api/tweet`,
                    body: { id },
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

        return NextResponse.json(response.data);
    } catch {
        return new NextResponse("[SCHEDULES_POST] Internal Server Error", { status: 500 });
    }
}
