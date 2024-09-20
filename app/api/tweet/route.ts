import db from "@/app/utils/firestore";
import openai from "@/app/utils/openai";
import twitterClient from "@/app/utils/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const dbSnapshot = await db.get();
        const { refreshToken } = dbSnapshot.data()!;

        const {
            client: refreshedClient,
            accessToken,
            refreshToken: newRefreshToken,
        } = await twitterClient.refreshOAuth2Token(refreshToken);

        await db.set({ accessToken, refreshToken: newRefreshToken });

        // const gptResponse = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system", content: "" },
        //         { role: "user", content: "" },
        //     ],
        //     max_tokens: 128
        // });
        // const tweet = gptResponse.choices[0].message.content;
        // if (!tweet) throw new Error();
        const tweet = "HELLO!";

        const { data } = await refreshedClient.v2.tweet(tweet);

        return NextResponse.json(data);
    } catch {
        return new NextResponse("[TWEET_POST] Internal Server Error", { status: 500 });
    }
}
