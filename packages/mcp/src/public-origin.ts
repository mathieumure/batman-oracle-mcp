export const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN ?? 'http://localhost:3000';

export const rewriteAssetOrigin = (html: string): string => html.replaceAll('http://localhost:3000', PUBLIC_ORIGIN);
