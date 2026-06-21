import { NextRequest, NextResponse } from "next/server";

import { postTweetForClient } from "@/lib/tweet";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        return NextResponse.json(await postTweetForClient(params.id));
    } catch (error) {
        console.log(error);
        return new NextResponse(`[TWEET_POST] ${error}`, { status: 500 });
    }
}
