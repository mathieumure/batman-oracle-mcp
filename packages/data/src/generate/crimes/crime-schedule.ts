const NIGHT_START_HOUR = 18;
const NIGHT_WINDOW_MINUTES = 12 * 60;

export const randomNightDateTime = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const windowStart = new Date(year, month - 1, day, NIGHT_START_HOUR, 0, 0, 0);
  const offsetMinutes = Math.floor(Math.random() * NIGHT_WINDOW_MINUTES);
  const occurredAt = new Date(windowStart.getTime() + offsetMinutes * 60_000);

  return occurredAt.toISOString();
};
