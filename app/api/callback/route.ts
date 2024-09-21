import db from "@/utils/firestore";
import twitterClient from "@/utils/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const state = req.nextUrl.searchParams.get("state");
        const code = req.nextUrl.searchParams.get("code");

        if (!state || !code) return new NextResponse("No Search Params Provided", { status: 400 });

        const dbSnapshot = await db.get();
        const { codeVerifier, state: storedState } = dbSnapshot.data()!;

        if (state !== storedState) return new NextResponse("Stored token does not match", { status: 400 });

        const { accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: `${process.env.HOST}/api/callback`,
        });

        await db.set({ accessToken, refreshToken });

        return NextResponse.json({});
    } catch {
        return new NextResponse("[CALLBACK_GET] Internal Server Error", { status: 500 });
    }
}
