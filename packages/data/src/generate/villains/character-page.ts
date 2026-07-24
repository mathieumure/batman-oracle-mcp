import { fetchWikitext } from './fandom-client.js';

export interface VillainDetails {
  realName: string | null;
  aliases: string[];
  relatives: string[];
  citizenship: string | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  eyes: string | null;
  hair: string | null;
  affiliation: string[];
}

export const resolveNewEarthPageTitle = async (name: string): Promise<string | null> => {
  const directPage = await fetchWikitext(`${name} (New Earth)`);
  if (directPage) {
    return directPage.title;
  }

  const plainPage = await fetchWikitext(name);
  const thumbnavMatch = plainPage?.wikitext.match(/\{\{thumbnav\|([^|]+)\|New Earth\|/);
  return thumbnavMatch?.[1].trim() ?? null;
};
