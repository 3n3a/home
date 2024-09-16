/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly API_URL: string;
    readonly API_USERNAME: string;
    readonly API_PASSWORD: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}