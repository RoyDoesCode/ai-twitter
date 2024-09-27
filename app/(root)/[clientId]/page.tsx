"use client";

import axios from "axios";
import { useParams } from "next/navigation";

import Loader from "@/components/ui/loader";
import { Client } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

import EditForm from "./components/edit-form";
import ScheduleForm from "./components/schedule-form";

export default function ClientPage() {
    const { clientId } = useParams();

    const { data: client, isFetching } = useQuery<Client>({
        queryKey: ["get-client"],
        queryFn: async () => (await axios.get(`/api/clients/${clientId}`)).data,
        gcTime: 0,
    });

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-10 pt-48 md:pt-0">
            {isFetching && <Loader />}
            {client && !isFetching && (
                <>
                    <h1 className="text-2xl font-bold">{client.name}</h1>
                    <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center">
                        <EditForm {...client} />
                        <div className="h-full w-px bg-secondary" />
                        <ScheduleForm {...client} />
                    </div>
                </>
            )}
        </main>
    );
}
