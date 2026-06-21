"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckIcon, CopyIcon, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LinkPage() {
    const { clientId } = useParams();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const link = useMemo(
        () => `${process.env.NEXT_PUBLIC_HOST}/api/auth?id=${clientId}`,
        [clientId]
    );

    useEffect(() => {
        copied && setTimeout(() => setCopied(false), 2000);
    }, [copied]);

    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(link);
        toast({ title: "Link copied successfully." });
    };

    return (
        <main className="min-h-screen pt-14">
            <div className="mx-auto max-w-2xl px-6 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All clients
                </Link>

                <div className="flex flex-col items-center gap-6 text-center py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Twitter className="h-7 w-7 text-primary" />
                    </div>

                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold">Connect Twitter account</h1>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Share this link with the client so they can authorize their Twitter account.
                        </p>
                    </div>

                    <div className="w-full rounded-xl border border-border bg-muted/50 px-5 py-4 flex items-center gap-3 text-left">
                        <p className="flex-1 text-sm text-foreground font-mono break-all">{link}</p>
                        <Button
                            size="icon"
                            variant={copied ? "default" : "outline"}
                            onClick={handleCopy}
                            disabled={copied}
                            className="shrink-0"
                        >
                            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
