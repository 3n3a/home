/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly API_URL: string;
    readonly API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}