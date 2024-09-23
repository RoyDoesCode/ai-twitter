"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { Client } from "@/utils/types";

const ClientRect: React.FC<Client> = ({ id, name }) => {
    const router = useRouter();

    return (
        <Button variant="outline" onClick={() => router.push(id)} className="min-w-48">
            {name}
        </Button>
    );
};

export default ClientRect;
