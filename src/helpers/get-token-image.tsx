import TestImg from "../assets/tokens/test.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "test") {
        return toUrl(TestImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
