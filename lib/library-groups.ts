export interface LibraryItem {
  id: string;
  name: string;
  imageUrl: string | null;
  subtitle?: string;
}

export interface LibraryGroup {
  id: string;
  heroImageUrl: string | null;
  heroName: string;
  items: LibraryItem[];
}

/** Splits items into `groupCount` roughly-even, contiguous groups so every item lands in some group. */
export function groupItems(items: LibraryItem[], groupCount: number): LibraryGroup[] {
  if (items.length === 0 || groupCount <= 0) return [];

  const baseSize = Math.floor(items.length / groupCount);
  const remainder = items.length % groupCount;
  const groups: LibraryGroup[] = [];
  let cursor = 0;

  for (let i = 0; i < groupCount; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);
    if (size === 0) break;
    const slice = items.slice(cursor, cursor + size);
    cursor += size;
    groups.push({
      id: `group-${i}`,
      heroImageUrl: slice[0].imageUrl,
      heroName: slice[0].name,
      items: slice,
    });
  }

  return groups;
}
