// Input must be sorted newest-first. Binary search locates the first possible
// item for a day in O(log n), then scans only the matching results.
export const findItemsByDateDescending = (items, date, getTimestamp) => {
  if (!date) return items;
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const startTime = start.getTime();
  const endTime = end.getTime();
  let low = 0;
  let high = items.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const timestamp = new Date(getTimestamp(items[middle])).getTime();
    if (timestamp >= endTime) low = middle + 1;
    else high = middle;
  }
  const matches = [];
  for (let index = low; index < items.length; index += 1) {
    const timestamp = new Date(getTimestamp(items[index])).getTime();
    if (timestamp < startTime) break;
    if (timestamp < endTime) matches.push(items[index]);
  }
  return matches;
};
