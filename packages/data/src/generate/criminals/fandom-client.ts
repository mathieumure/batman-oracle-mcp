const FANDOM_API_BASE_URL = 'https://dc.fandom.com/api.php';

export interface FandomWikitextPage {
  title: string;
  pageId: number;
  wikitext: string;
}

interface FandomParseResponse {
  parse?: { title: string; pageid: number; wikitext: { '*': string } };
  error?: { code: string; info: string };
}

interface FandomPageImagesResponse {
  query: { pages: Record<string, { thumbnail?: { source: string } }> };
}

const buildFandomApiUrl = (params: Record<string, string>): URL => {
  const url = new URL(FANDOM_API_BASE_URL);
  url.searchParams.set('format', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
};

export const fetchWikitext = async (page: string): Promise<FandomWikitextPage | null> => {
  const url = buildFandomApiUrl({ action: 'parse', page, prop: 'wikitext', section: '0' });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fandom API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as FandomParseResponse;
  if (!data.parse) {
    return null;
  }
  return { title: data.parse.title, pageId: data.parse.pageid, wikitext: data.parse.wikitext['*'] };
};

export const fetchPageThumbnail = async (title: string): Promise<string | null> => {
  const url = buildFandomApiUrl({ action: 'query', titles: title, prop: 'pageimages', pithumbsize: '500' });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fandom API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as FandomPageImagesResponse;
  const page = Object.values(data.query.pages)[0];
  return page?.thumbnail?.source ?? null;
};
