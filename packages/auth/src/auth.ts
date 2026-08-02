import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { oauthProvider } from '@better-auth/oauth-provider';
import Database from 'better-sqlite3';
import { join } from 'node:path';
import { AUTH_ORIGIN, MCP_ORIGIN, BETTER_AUTH_SECRET } from './config.js';

export const auth = betterAuth({
  basePath: '',
  baseURL: AUTH_ORIGIN,
  secret: BETTER_AUTH_SECRET,
  database: new Database(join(import.meta.dirname, '../auth.db')),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt(),
    oauthProvider({
      loginPage: '/login',
      consentPage: '/consent',
      validAudiences: [`${MCP_ORIGIN}/mcp`],
      scopes: ['openid', 'profile', 'email', 'offline_access', 'mcp:tools'],
      accessTokenExpiresIn: 60,
      allowDynamicClientRegistration: true,
      allowUnauthenticatedClientRegistration: true,
    }),
  ],
});
