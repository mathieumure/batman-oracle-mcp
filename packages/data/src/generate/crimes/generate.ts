import { writeFile } from 'node:fs/promises';
import { generateCrimes } from './index.js';

console.log('Generating crimes...');

const crimes = await generateCrimes();

const outputUrl = new URL('../../../crimes.ts', import.meta.url);
const fileContent = `import type { Crime } from './src/generate/crimes/crime.js';

export const crimes: Crime[] = ${JSON.stringify(crimes, null, 2)};
`;

await writeFile(outputUrl, fileContent, 'utf-8');

console.log(`Wrote ${crimes.length} crimes to ${outputUrl.pathname}`);
