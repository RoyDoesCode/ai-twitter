"use client";

import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { COUNTRY_OPTIONS } from "@/utils/consts";
import { Client } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    industry: z.string().min(1, "Industry is required."),
    woeid: z.string().min(1, "Country is required."),
    systemPrompt: z.string().min(1, "System prompt is required."),
    userPrompt: z.string().min(1, "User prompt is required."),
});

const EditForm: React.FC<Client> = ({ id, name, industry, woeid, systemPrompt, userPrompt }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name,
            industry,
            woeid: woeid.toString(),
            systemPrompt,
            userPrompt,
        },
    });

    const disabled =
        loading ||
        JSON.stringify(form.getValues()) === JSON.stringify({ name, industry, woeid, systemPrompt, userPrompt });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        axios
            .patch(`/api/clients/${id}`, values)
            .then(() => queryClient.refetchQueries({ queryKey: ["get-client"] }))
            .catch(() => toast({ title: "There was an error with your request.", variant: "destructive" }))
            .finally(() => setLoading(false));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[560px] p-8 space-y-4 w-full">
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
                                    Client ID: <span className="text-foreground font-medium">{id}</span>
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client&apos;s industry *</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="woeid"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the client's country for getting trends" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {COUNTRY_OPTIONS.map(({ woeid, name }) => (
                                        <SelectItem key={woeid} value={woeid.toString()}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            <FormDescription />
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
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={disabled} className="w-full h-10">
                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Update settings
                </Button>
            </form>
        </Form>
    );
};

export default EditForm;
