import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

const Loader: React.FC = () => {
    return (
        <ReloadIcon
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
