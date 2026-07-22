export const extractTemplateField = (wikitext: string, fieldName: string): string => {
  const match = wikitext.match(new RegExp(`\\|[ \\t]*${fieldName}[ \\t]*=[ \\t]*(.*)`));
  return match?.[1] ?? '';
};

export const extractWikiLinkNames = (fieldValue: string): string[] => {
  const names: string[] = [];
  for (const match of fieldValue.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
    names.push(match[2] ?? match[1]);
  }
  return names;
};

export const cleanWikiText = (value: string): string => {
  return value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/'''/g, '')
    .replace(/''/g, '')
    .replace(/^[,;\s]+|[,;\s]+$/g, '')
    .trim();
};

const TOP_LEVEL_SEPARATOR = /^(?:<br\s*\/?>|[,;])/i;

const splitAtTopLevel = (value: string): string[] => {
  const entries: string[] = [];
  let depth = 0;
  let current = '';
  let index = 0;

  while (index < value.length) {
    const char = value[index];
    if (char === '(' || char === '[') depth++;
    if (char === ')' || char === ']') depth--;

    const separatorMatch = depth <= 0 ? TOP_LEVEL_SEPARATOR.exec(value.slice(index)) : null;
    if (separatorMatch) {
      entries.push(current);
      current = '';
      index += separatorMatch[0].length;
      continue;
    }

    current += char;
    index++;
  }

  entries.push(current);
  return entries;
};

export const splitWikiList = (value: string): string[] => {
  return splitAtTopLevel(value)
    .map((entry) => cleanWikiText(entry))
    .filter((entry) => entry.length > 0);
};
