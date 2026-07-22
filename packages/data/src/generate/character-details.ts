import { fetchWikitext } from './fandom-client.js';
import { resolveNewEarthPageTitle, type VillainDetails } from './character-page.js';
import { cleanWikiText, extractTemplateField, splitWikiList } from './wikitext.js';

const extractScalarField = (wikitext: string, fieldName: string): string | null => {
  const value = cleanWikiText(extractTemplateField(wikitext, fieldName));
  return value.length > 0 ? value : null;
};

export const fetchVillainDetails = async (name: string): Promise<VillainDetails | null> => {
  const pageTitle = await resolveNewEarthPageTitle(name);
  if (!pageTitle) {
    return null;
  }

  const page = await fetchWikitext(pageTitle);
  if (!page) {
    return null;
  }

  const { wikitext } = page;
  return {
    realName: extractScalarField(wikitext, 'RealName'),
    aliases: splitWikiList(extractTemplateField(wikitext, 'Aliases')),
    relatives: splitWikiList(extractTemplateField(wikitext, 'Relatives')),
    citizenship: extractScalarField(wikitext, 'Citizenship'),
    gender: extractScalarField(wikitext, 'Gender'),
    height: extractScalarField(wikitext, 'Height'),
    weight: extractScalarField(wikitext, 'Weight'),
    eyes: extractScalarField(wikitext, 'Eyes'),
    hair: extractScalarField(wikitext, 'Hair'),
    affiliation: splitWikiList(extractTemplateField(wikitext, 'Affiliation')),
  };
};
