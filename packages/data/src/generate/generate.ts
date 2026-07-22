import { writeFile } from 'node:fs/promises';
import { fetchBatmanVillains } from './villains.js';

console.log('Generating villains...');

const villains = await fetchBatmanVillains();

const outputUrl = new URL('../../villains.ts', import.meta.url);
const fileContent = `import type { BatmanVillain } from './src/generate/villains.js';

export const villains: BatmanVillain[] = ${JSON.stringify(villains, null, 2)};
`;

await writeFile(outputUrl, fileContent, 'utf-8');

console.log(`Wrote ${villains.length} villains to ${outputUrl.pathname}`);
