"use client";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/utils/types";

import ClientForm from "./components/client-form";

export default function ClientPage() {
    const { clientId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { data: client, isFetching } = useQuery<Client>({
        queryKey: ["get-client"],
        queryFn: async () => (await axios.get(`/api/clients/${clientId}`)).data,
        refetchOnWindowFocus: false,
        gcTime: 0,
    });

    return (
        <main className="min-h-screen pt-14">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All clients
                </Link>

                {isFetching && (
                    <div className="relative h-32">
                        <Loader />
                    </div>
                )}

                {client && !isFetching && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                                    {client.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">{client.name}</h1>
                                    <p className="text-xs text-muted-foreground">ID: {client.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {confirming ? (
                                    <>
                                        <span className="text-sm text-muted-foreground">Delete client?</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setConfirming(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deleting}
                                            onClick={async () => {
                                                setDeleting(true);
                                                try {
                                                    await axios.delete(`/api/clients/${client.id}`);
                                                    router.push("/");
                                                } catch {
                                                    toast({ title: "Failed to delete client.", variant: "destructive" });
                                                    setDeleting(false);
                                                    setConfirming(false);
                                                }
                                            }}
                                        >
                                            {deleting ? "Deleting…" : "Delete"}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40"
                                        onClick={() => setConfirming(true)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                        Delete client
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            <ClientForm {...client} />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
