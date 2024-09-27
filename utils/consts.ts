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

export function convertHoursToCron(interval: number, startHour: Date): string {
    const hour = startHour.getUTCHours();
    const minute = startHour.getUTCMinutes();

    if (interval < 1) {
        throw new Error("Interval of hours must be 1 or greater.");
    }

    if (interval <= 24) {
        return `${minute} ${hour}-${23}/${interval} * * *`;
    }

    const days = Math.floor(interval / 24);
    const hours = interval % 24;

    if (hours === 0) {
        return `${minute} ${hour} */${days} * *`;
    } else {
        return `${minute} ${hour + hours} */${days} * *`;
    }
}
