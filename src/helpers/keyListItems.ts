export function keyListItems<Item>(
  items: Item[],
  identify: (item: Item) => string
) {
  const counts = new Map<string, number>();
  return items.map((item) => {
    const id = identify(item);
    const occurrence = counts.get(id) ?? 0;
    counts.set(id, occurrence + 1);
    return { item, key: JSON.stringify([id, occurrence]) };
  });
}
