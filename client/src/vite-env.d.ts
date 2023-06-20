/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_WS_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
