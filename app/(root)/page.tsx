"use client";

import axios from "axios";
import Link from "next/link";
import { Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Client } from "@/utils/types";

import ClientRect from "./components/client-rect";

export default function Home() {
    const { data: clients, isFetching } = useQuery<Client[]>({
        queryKey: ["get-clients"],
        queryFn: async () => (await axios.get("/api/clients")).data,
        refetchOnWindowFocus: false,
        gcTime: 0,
    });

    const hasClients = !isFetching && clients && clients.length > 0;
    const isEmpty = !isFetching && clients && clients.length === 0;

    return (
        <main className="min-h-screen pt-20">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {isFetching && (
                    <div className="relative h-32">
                        <Loader />
                    </div>
                )}

                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                            <Twitter className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-semibold">No clients yet</h2>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Register your first Twitter client to start scheduling AI-generated tweets.
                            </p>
                        </div>
                        <Button asChild className="mt-1">
                            <Link href="/register">Register a client</Link>
                        </Button>
                    </div>
                )}

                {hasClients && (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-lg font-semibold">Clients</h2>
                                <span className="text-sm text-muted-foreground">{clients.length}</span>
                            </div>
                            <Button asChild size="sm">
                                <Link href="/register">+ Add client</Link>
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {clients.map((client) => (
                                <ClientRect key={client.id} {...client} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
