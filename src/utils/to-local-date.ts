export const toLocalDate = (raw: Date | string) => {
  const date = raw instanceof Date ? raw : new Date(raw);

  const [year, month, dayMonth] = date
    .toISOString()
    .slice(0, 10)
    .split('-')
    .map(Number);

  return new Date(year, month - 1, dayMonth);
};
