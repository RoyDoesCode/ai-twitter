import db from "@/utils/firestore";
import openai from "@/utils/openai";
import twitterClient from "@/utils/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = await db.doc(params.id).get();
        const { refreshToken, prompt } = client.data()!;

        const {
            client: refreshedClient,
            accessToken,
            refreshToken: newRefreshToken,
        } = await twitterClient.refreshOAuth2Token(refreshToken);

        await db.doc(params.id).update({ accessToken, refreshToken: newRefreshToken });

        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: "Create a tweet" },
            ],
            max_tokens: 512,
        });

        const tweet = gptResponse.choices[0].message.content;
        if (!tweet) throw new Error();

        const { data } = await refreshedClient.v2.tweet(tweet.replace(/^['"]+|['"]+$/g, ""));

        return NextResponse.json(data);
    } catch {
        return new NextResponse("[TWEET_POST] Internal Server Error", { status: 500 });
    }
}
