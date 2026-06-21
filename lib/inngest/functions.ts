import parser from "cron-parser";

import db from "@/lib/firestore";
import { postTweetForClient } from "@/lib/tweet";

import inngest from "./";

export const runTweet = inngest.createFunction(
    {
        id: "run-tweet",
        triggers: [{ event: "tweet/scheduled" }],
        cancelOn: [{ event: "tweet/cancelled", match: "data.clientId" }],
    },
    async ({ event, step }) => {
        const clientId = event.data.clientId as string;

        // 1) run the tweet now
        await step.run(`post-tweet-${clientId}`, async () => {
            await postTweetForClient(clientId);
        });

        // 2) load cron from Firestore (it may have changed)
        const { cron } = await step.run("load-cron", async () => {
            const snap = await db.doc(clientId).get();
            return { cron: snap.data()?.cron as string | undefined };
        });

        if (!cron) return; // user deleted schedule in the meantime

        // 3) compute next run & schedule the next execution
        const nextTs = parser.parse(cron, { tz: "Asia/Jerusalem" }).next().getTime();

        await step.run("schedule-next", async () => {
            await inngest.send({
                name: "tweet/scheduled",
                data: { clientId, cron },
                ts: nextTs,
            });
        });

        return { scheduledNextAt: new Date(nextTs).toISOString() };
    }
);
