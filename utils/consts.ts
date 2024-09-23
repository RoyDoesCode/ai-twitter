import woeid from "./woeid.json";

export const COUNTRY_OPTIONS = woeid.filter(({ placeType }) => placeType.name === "Country");

export function generateIdFromName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
