import * as dotenv from 'dotenv';

dotenv.config();

/** Where the logged-in session is saved by tests/auth.setup.ts. */
export const STORAGE_STATE = '.auth/user.json';

/**
 * Single source of truth for environment config.
 * Nothing environment-specific (URLs, credentials) is hard-coded in tests.
 */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://stg-bill.lkgforbilling.com',
  apiUrl: process.env.API_URL ?? 'https://stg-api.lkgforbilling.com',
  /** Optional real test account. Authenticated tests are skipped when unset. */
  user: {
    email: process.env.LKG_EMAIL ?? '',
    password: process.env.LKG_PASSWORD ?? '',
  },
  get hasCredentials(): boolean {
    return Boolean(this.user.email && this.user.password);
  },
};
