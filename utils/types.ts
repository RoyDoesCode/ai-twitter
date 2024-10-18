export type Client = {
    id: string;
    name: string;
    systemPrompt: string;
    userPrompt: string;
    cron?: string;
    active?: boolean;
    scheduleId?: string;
    codeVerifier?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
};
