"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { Client } from "@/utils/types";

const ClientRect: React.FC<Client> = ({ id, name, active }) => {
    const router = useRouter();

    return (
        <Button variant="outline" onClick={() => router.push(id)} className="relative min-w-48">
            {name}
            {active && <div className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />}
        </Button>
    );
};

export default ClientRect;
