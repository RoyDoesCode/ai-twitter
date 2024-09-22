"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Client } from "../utils/types";
import axios from "axios";

export default function ClientPage() {
    const { clientId } = useParams();

    const [client, setClient] = useState<Client>();

    useEffect(() => {
        axios.get(`/api/clients/${clientId}`).then((res) => setClient(res.data));
    }, [clientId]);

    if (!client) return null;

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-10">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            {/* <ClientForm /> */}
        </main>
    );
}
