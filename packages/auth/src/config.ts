export const AUTH_PORT = Number(process.env.AUTH_PORT ?? 3001);
export const AUTH_ORIGIN = process.env.AUTH_ORIGIN ?? `http://localhost:${AUTH_PORT}`;
export const MCP_ORIGIN = process.env.MCP_ORIGIN ?? 'http://localhost:3000';
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? 'batman-oracle-demo-secret-please-rotate-0000';
