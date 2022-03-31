import TestImg from "../assets/tokens/jupiter.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "jupiter") {
        return toUrl(TestImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
