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
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import { COUNTRY_OPTIONS, generateIdFromName } from "./utils/consts";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    industry: z.string().min(1, "Industry is required."),
    woeid: z.string().min(1, "Country is required."),
    prompt: z.string().min(1, "Persona is required."),
});

const ClientForm: React.FC = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            industry: "",
            woeid: "",
            prompt: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const id = generateIdFromName(values.name);

        axios
            .post("/api/clients", { ...values, id })
            .then(() => toast({ title: "Succefully registered client." }))
            .catch(() => toast({ title: "There was an error with your request.", variant: "destructive" }))
            .finally(() => setLoading(false));
        // Create firestore document
        // Pass document id param to auth
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[640px] p-8 space-y-4 w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client's name *</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            {field.value && (
                                <FormDescription>
                                    Client ID:{" "}
                                    <span className="text-foreground font-medium">
                                        {generateIdFromName(field.value)}
                                    </span>
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
                            <FormLabel>Client's industry *</FormLabel>
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
                    name="prompt"
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
                <Button type="submit" disabled={loading} className="w-full h-10">
                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Register Client
                </Button>
            </form>
        </Form>
    );
};

export default ClientForm;
