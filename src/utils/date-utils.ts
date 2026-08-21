export function toIsoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function uniqueTimestamp(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}
