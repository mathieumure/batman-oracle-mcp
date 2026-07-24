import { fetchPageThumbnail, fetchWikitext } from './fandom-client.js';
import { extractTemplateField, extractWikiLinkNames } from './wikitext.js';
import { fetchVillainDetails } from './character-details.js';
import { type VillainDetails } from './character-page.js';

export interface BatmanVillain {
  name: string;
  picture: string | null;
  details: VillainDetails | null;
}

const ROGUES_GALLERY_FIELDS = ['ArchVillains', 'CurrentMembers', 'FormerMembers', 'DeceasedMembers'];

export const parseVillainNames = (wikitext: string): string[] => {
  const names = ROGUES_GALLERY_FIELDS.flatMap((field) => extractWikiLinkNames(extractTemplateField(wikitext, field)));
  return [...new Set(names)];
};

export const fetchBatmanVillains = async (): Promise<BatmanVillain[]> => {
  const page = await fetchWikitext('Batman_Villains');
  if (!page) {
    throw new Error('Batman_Villains page could not be found on dc.fandom.com');
  }
  console.log('[INFO] Base page reached');

  const names = parseVillainNames(page.wikitext);
  console.log(`[INFO] Found ${names.length} villains to fetch`);
  return Promise.all(
    names.map(async (name) => ({
      name,
      picture: await fetchPageThumbnail(name),
      details: await fetchVillainDetails(name),
    })),
  );
};
