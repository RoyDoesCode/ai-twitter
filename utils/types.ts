export type Client = {
    id: string;
    name: string;
    woeid: number;
    industry: string;
    prompt: string;
    cron?: string;
    active?: boolean;
    scheduleId?: string;
    codeVerifier?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
};
