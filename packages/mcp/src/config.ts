export const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN ?? 'http://localhost:3000';
export const GCPD_API = process.env.GCPD_API ?? 'http://localhost:3000';
export const AUTH_ORIGIN = process.env.AUTH_ORIGIN ?? 'http://localhost:3001';
// Change this to true to enforce OAuth on /mcp without setting REQUIRE_AUTH by hand.
// Must be true for any server reachable from Claude or the internet.
const REQUIRE_AUTH_DEFAULT = false;

export const REQUIRE_AUTH = process.env.REQUIRE_AUTH ? process.env.REQUIRE_AUTH === 'true' : REQUIRE_AUTH_DEFAULT;
