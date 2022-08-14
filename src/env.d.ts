/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly API_URL: string;
    readonly API_CLIENT_TOKEN: string;
    readonly API_CLIENT_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}