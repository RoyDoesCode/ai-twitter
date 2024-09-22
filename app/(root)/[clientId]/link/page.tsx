"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LinkPage() {
    const { clientId } = useParams();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const link = useMemo(() => `${process.env.NEXT_PUBLIC_HOST}/api/auth?id=${clientId}`, []);

    useEffect(() => {
        copied && setTimeout(() => setCopied(false), 2000);
    }, [copied]);

    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(link);
        toast({ title: "Link copied successfully." });
    };

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Client Auth Link:</h1>
            <div className="relative pr-14 pl-6 py-3 min-w-[500px] text-center bg-secondary rounded-xl border border-input">
                <p>{link}</p>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={copied}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
            </div>
        </main>
    );
}
