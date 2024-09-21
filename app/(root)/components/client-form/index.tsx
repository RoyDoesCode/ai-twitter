"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { COUNTRY_OPTIONS, generateIdFromName } from "./utils/consts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    industry: z.string().min(1, "Industry is required."),
    woeid: z.string().min(1, "Country is required."),
    persona: z.string().min(1, "Persona is required."),
});

const ClientForm: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            industry: "",
            woeid: "",
            persona: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                    name="persona"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Persona *</FormLabel>
                            <FormControl>
                                <Textarea placeholder="The GPT system prompt" className="h-40" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full h-10">
                    Generate Auth Link
                </Button>
            </form>
        </Form>
    );
};

export default ClientForm;
