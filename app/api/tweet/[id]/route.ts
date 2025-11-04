import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/firestore";
import openai from "@/lib/openai";
import twitterClient from "@/lib/twitter";
import { Client } from "@/utils/types";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = await db.doc(params.id).get();
        const { refreshToken, systemPrompt, userPrompt } = client.data()! as Client;

        if (!refreshToken) {
            return new NextResponse("No refresh token.", { status: 400 });
        }

        const {
            client: refreshedClient,
            accessToken,
            refreshToken: newRefreshToken,
        } = await twitterClient.refreshOAuth2Token(refreshToken);

        await db.doc(params.id).update({ accessToken, refreshToken: newRefreshToken });

        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 1024,
        });

        const tweet = gptResponse.choices[0].message.content?.replace(/^['"]+|['"]+$/g, "");
        if (!tweet) throw new Error();

        const { data } = await refreshedClient.v2.tweet(tweet);

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return new NextResponse(`[TWEET_POST] ${error}`, { status: 500 });
    }
}
