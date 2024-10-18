"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { COUNTRY_OPTIONS, generateIdFromName } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    systemPrompt: z.string().min(1, "System prompt is required."),
    userPrompt: z.string().min(1, "User prompt is required."),
});

const RegisterForm: React.FC = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            systemPrompt: "",
            userPrompt: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const id = generateIdFromName(values.name);
        setLoading(true);

        axios
            .post("/api/clients", { ...values, id })
            .then(() => router.push(`/${id}/link`))
            .catch(() => toast({ title: "There was an error with your request.", variant: "destructive" }))
            .finally(() => setLoading(false));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[640px] p-8 space-y-4 w-full">
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
                <Button type="submit" disabled={loading} className="w-full h-10">
                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Register Client
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;
