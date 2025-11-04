import { serve } from "inngest/next";

import inngest from "@/lib/inngest";
import { runTweet } from "@/lib/inngest/functions";

export const { GET, POST } = serve({ client: inngest, functions: [runTweet] });

export const runtime = "nodejs";
