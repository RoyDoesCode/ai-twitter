import React from "react";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Loader2 as LucideLoader } from "lucide-react"

const Loader: React.FC = () => {
    return (
        <LucideLoader
            className="
                absolute 
                top-[calc(50%-0.5rem)] 
                left-[calc(50%-0.5rem)] 
                h-4 
                w-4 
                animate-spin
            "
        />
    );
};

export default Loader;
