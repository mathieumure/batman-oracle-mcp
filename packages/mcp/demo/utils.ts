import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const resolveDistFiles = async (path: string): Promise<string> => {
  return readFile(join(import.meta.dirname, `../../mcp-ui/dist/${path}`), 'utf-8');
};
