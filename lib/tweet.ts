import db from "@/lib/firestore";
import openai from "@/lib/openai";
import twitterClient from "@/lib/twitter";
import { Client } from "@/utils/types";

function formatXError(error: unknown) {
    if (error && typeof error === "object") {
        const xError = error as {
            code?: number;
            data?: unknown;
            errors?: unknown;
            message?: string;
            rateLimit?: unknown;
        };

        return JSON.stringify({
            code: xError.code,
            message: xError.message,
            data: xError.data,
            errors: xError.errors,
            rateLimit: xError.rateLimit,
        });
    }

    return String(error);
}

export async function postTweetForClient(clientId: string) {
    const client = await db.doc(clientId).get();
    const data = client.data() as Client | undefined;

    if (!data) {
        throw new Error(`Client ${clientId} not found.`);
    }

    const { refreshToken, systemPrompt, userPrompt } = data;

    if (!refreshToken) {
        throw new Error(`Client ${clientId} has no refresh token.`);
    }

    const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } = await twitterClient
        .refreshOAuth2Token(refreshToken)
        .catch((error) => {
            throw new Error(`X token refresh failed for client ${clientId}: ${formatXError(error)}`);
        });

    await db.doc(clientId).update({ accessToken, refreshToken: newRefreshToken });

    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `${systemPrompt}\n\nReturn only one tweet. Keep it under 280 characters.`,
            },
            { role: "user", content: userPrompt },
        ],
        max_tokens: 80,
    });

    const tweet = gptResponse.choices[0].message.content?.trim().replace(/^['"]+|['"]+$/g, "");

    if (!tweet) {
        throw new Error(`OpenAI returned an empty tweet for client ${clientId}.`);
    }

    if (tweet.length > 280) {
        throw new Error(`Generated tweet is ${tweet.length} characters; X limit is 280.`);
    }

    const { data: tweeted } = await refreshedClient.v2.tweet(tweet).catch((error) => {
        throw new Error(`X tweet creation failed for client ${clientId}: ${formatXError(error)}`);
    });

    return tweeted;
}
