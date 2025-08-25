interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
  readonly VITE_SANITY_TOKEN: string;
  readonly VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
