"use client";

import axios from "axios";

import Loader from "@/components/ui/loader";
import { Client } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

import ClientRect from "./components/client-rect";

export default function Home() {
    const { data: clients, isFetching } = useQuery<Client[]>({
        queryKey: ["get-clients"],
        queryFn: async () => (await axios.get("/api/clients")).data,
        refetchOnWindowFocus: false,
        gcTime: 0,
    });

    return (
        <main className="flex flex-wrap px-6 py-20 gap-3">
            {isFetching && <Loader />}
            {clients?.map((client) => (
                <ClientRect key={client.id} {...client} />
            ))}
        </main>
    );
}
