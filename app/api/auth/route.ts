import db from "@/app/utils/firestore";
import twitterClient from "@/app/utils/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(`${process.env.HOST}/api/callback`, {
            scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
        });

        await db.set({ codeVerifier, state });

        return NextResponse.redirect(url);
    } catch {
        return new NextResponse("[AUTH_GET] Internal Server Error", { status: 500 });
    }
}
