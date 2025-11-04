import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/firestore";
import twitterClient from "@/lib/twitter";

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return new NextResponse("No Client ID Provided", { status: 400 });

        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
            `${process.env.NEXT_PUBLIC_HOST}/api/callback?id=${id}`,
            {
                scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
            }
        );

        await db.doc(id).update({ codeVerifier, state });

        return NextResponse.redirect(url);
    } catch {
        return new NextResponse("[AUTH_GET] Internal Server Error", { status: 500 });
    }
}
