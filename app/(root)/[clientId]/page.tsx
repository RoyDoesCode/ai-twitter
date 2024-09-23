"use client";

import axios from "axios";
import { useParams } from "next/navigation";

import Loader from "@/components/ui/loader";
import { Client } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import EditForm from "./components/edit-form";

export default function ClientPage() {
    const { clientId } = useParams();

    const { data: client, isFetching } = useQuery<Client>({
        queryKey: ["get-client"],
        queryFn: async () => (await axios.get(`/api/clients/${clientId}`)).data,
        gcTime: 0,
    });

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-10">
            {isFetching && <Loader />}
            {client && (
                <>
                    <h1 className="text-2xl font-bold">{client.name}</h1>
                    <EditForm {...client} />
                </>
            )}
        </main>
    );
}
