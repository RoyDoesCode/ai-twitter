"use client";

import React, { useEffect, useState } from "react";
import ClientRect from "./components/client-rect";
import { Client } from "./utils/types";
import axios from "axios";

export default function Home() {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        axios.get("/api/clients").then((res) => setClients(res.data));
    }, []);

    return (
        <main className="flex flex-wrap px-6 py-20 gap-3">
            {clients.map((client) => (
                <ClientRect key={client.id} {...client} />
            ))}
        </main>
    );
}
