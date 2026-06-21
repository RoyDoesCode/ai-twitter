"use client";

import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    systemPrompt: z.string().min(1, "System prompt is required."),
    userPrompt: z.string().min(1, "User prompt is required."),
    cron: z.string().optional(),
    active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const ClientForm: React.FC<Client> = ({ id, name, systemPrompt, userPrompt, cron, active }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const defaultValues: FormValues = {
        name,
        systemPrompt,
        userPrompt,
        cron: cron ?? "",
        active: active ?? false,
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const disabled = loading || !form.formState.isDirty;

    function onSubmit(values: FormValues) {
        setLoading(true);
        axios
            .patch(`/api/clients/${id}`, values)
            .then(() => {
                form.reset(values);
                queryClient.refetchQueries({ queryKey: ["get-client"] });
            })
            .catch(() =>
                toast({ title: "There was an error with your request.", variant: "destructive" })
            )
            .finally(() => setLoading(false));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Prompts */}
                    <div className="p-6 md:p-8 space-y-4 border-b md:border-b-0 md:border-r border-border">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Prompts
                        </h2>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client&apos;s name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    {field.value && (
                                        <FormDescription>
                                            Client ID:{" "}
                                            <span className="text-foreground font-medium">{id}</span>
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System prompt *</FormLabel>
                                    <FormControl>
                                        <Textarea className="h-40" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User prompt *</FormLabel>
                                    <FormControl>
                                        <Textarea className="h-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Schedule */}
                    <div className="p-6 md:p-8 space-y-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Schedule
                        </h2>
                        <FormField
                            control={form.control}
                            name="cron"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cron Expression</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0 9 * * *" {...field} />
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
                </div>

                <div className="px-6 py-4 md:px-8 border-t border-border flex justify-end">
                    <Button type="submit" disabled={disabled} className="min-w-32">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ClientForm;
