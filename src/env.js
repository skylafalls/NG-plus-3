export const DEV = import.meta.env.VITE_DEV === "true";
export const STEAM = import.meta.env.VITE_STEAM === "true";
export const MAC = globalThis.navigator.userAgent.includes("Mac OS X");
