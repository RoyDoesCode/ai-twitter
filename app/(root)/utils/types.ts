export type Client = {
    id: string;
    name: string;
    woeid: number;
    industry: string;
    prompt: string;
    codeVerifier?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
};
