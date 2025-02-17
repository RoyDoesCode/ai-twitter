import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    cron: z.string().min(1, "Cron expression is required"),
    active: z.boolean(),
});

const ScheduleForm: React.FC<Client> = ({ id, cron, active }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cron,
            active,
        },
    });

    const disabled =
        loading || JSON.stringify(form.getValues()) === JSON.stringify({ cron, active });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        axios
            .patch(`/api/clients/${id}`, values)
            .then(() => queryClient.refetchQueries({ queryKey: ["get-client"] }))
            .catch(() =>
                toast({ title: "There was an error with your request.", variant: "destructive" })
            )
            .finally(() => setLoading(false));
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-[560px] flex flex-col justify-between p-8 w-full h-full gap-6"
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="cron"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cron Expression *</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Active</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={disabled} className="w-full h-10">
                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Update scheduling
                </Button>
            </form>
        </Form>
    );
};

export default ScheduleForm;
