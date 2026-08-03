import type { Crime as BaseCrime } from '@batman/data/src/generate/crimes/crime.js';

export type Crime = BaseCrime & { suspectPicture: string };
