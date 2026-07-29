import { writeFile } from 'node:fs/promises';
import { fetchBatmanCriminals } from './index.js';

console.log('Generating criminals...');

const criminals = await fetchBatmanCriminals();

const outputUrl = new URL('../../../criminals.ts', import.meta.url);
const fileContent = `import type { BatmanCriminal } from './src/generate/criminals/index.js';

export const criminals: BatmanCriminal[] = ${JSON.stringify(criminals, null, 2)};
`;

await writeFile(outputUrl, fileContent, 'utf-8');

console.log(`Wrote ${criminals.length} criminals to ${outputUrl.pathname}`);
