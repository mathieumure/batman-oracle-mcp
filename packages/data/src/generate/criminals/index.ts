import { fetchPageThumbnail, fetchWikitext } from './fandom-client.js';
import { extractTemplateField, extractWikiLinkNames } from './wikitext.js';
import { fetchCriminalDetails } from './character-details.js';
import { type CriminalDetails } from './character-page.js';

export interface BatmanCriminal {
  name: string;
  picture: string | null;
  details: CriminalDetails | null;
}

const ROGUES_GALLERY_FIELDS = ['ArchVillains', 'CurrentMembers', 'FormerMembers', 'DeceasedMembers'];

export const parseCriminalNames = (wikitext: string): string[] => {
  const names = ROGUES_GALLERY_FIELDS.flatMap((field) => extractWikiLinkNames(extractTemplateField(wikitext, field)));
  return [...new Set(names)];
};

export const fetchBatmanCriminals = async (): Promise<BatmanCriminal[]> => {
  const page = await fetchWikitext('Batman_Villains');
  if (!page) {
    throw new Error('Batman_Villains page could not be found on dc.fandom.com');
  }
  console.log('[INFO] Base page reached');

  const names = parseCriminalNames(page.wikitext);
  console.log(`[INFO] Found ${names.length} criminals to fetch`);
  return Promise.all(
    names.map(async (name) => ({
      name,
      picture: await fetchPageThumbnail(name),
      details: await fetchCriminalDetails(name),
    })),
  );
};
