"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Client } from "@/utils/types";

const ClientRect: React.FC<Client> = ({ id, name, active, cron }) => {
    const router = useRouter();
    const initials = name.slice(0, 2).toUpperCase();

    return (
        <button
            onClick={() => router.push(id)}
            className="group relative flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 w-52 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {active && (
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
            )}

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                {initials}
            </div>

            <div className="w-full">
                <p className="font-semibold text-sm text-foreground truncate pr-4">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {active ? "Scheduling active" : cron ? "Schedule paused" : "No schedule"}
                </p>
            </div>
        </button>
    );
};

export default ClientRect;
