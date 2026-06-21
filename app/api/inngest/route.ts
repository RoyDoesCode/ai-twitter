import { serve } from "inngest/next";

import inngest from "@/lib/inngest";
import { runTweet } from "@/lib/inngest/functions";

const serveOrigin = process.env.NEXT_PUBLIC_HOST?.replace(/\/$/, "");

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [runTweet],
    serveOrigin,
    servePath: "/api/inngest",
});

export const runtime = "nodejs";
