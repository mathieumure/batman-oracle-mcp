import { PUBLIC_ORIGIN } from './config.js';

export const rewriteAssetOrigin = (html: string): string => html.replaceAll('http://localhost:3000', PUBLIC_ORIGIN);
