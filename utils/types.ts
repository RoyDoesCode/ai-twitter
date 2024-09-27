export type Client = {
    id: string;
    name: string;
    woeid: number;
    industry: string;
    prompt: string;
    startHour?: Date;
    interval?: number;
    active?: boolean;
    codeVerifier?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
};
