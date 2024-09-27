import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const response = await axios.delete(`https://api.mergent.co/v2/schedules/${params.id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
            },
        });

        return NextResponse.json(response.data);
    } catch {
        return new NextResponse("[SCHEDULE_DELETE] Internal Server Error", { status: 500 });
    }
}
