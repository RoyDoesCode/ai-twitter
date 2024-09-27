import db from "@/utils/firestore";
import openai from "@/utils/openai";
import twitterClient from "@/utils/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) return new NextResponse("No Client ID Provided", { status: 400 });

        const client = await db.doc(id).get();
        const { refreshToken, prompt } = client.data()!;

        const {
            client: refreshedClient,
            accessToken,
            refreshToken: newRefreshToken,
        } = await twitterClient.refreshOAuth2Token(refreshToken);

        await db.doc(id).update({ accessToken, refreshToken: newRefreshToken });

        // const gptResponse = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system", content: prompt },
        //         { role: "user", content: "Create a tweet" },
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
