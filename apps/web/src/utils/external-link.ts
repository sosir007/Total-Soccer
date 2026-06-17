export function buildExternalUrl(url: string | null | undefined, fallbackName: string) {
  const trimmed = url?.trim();

  if (trimmed) {
    return trimmed;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(fallbackName)}`;
}
