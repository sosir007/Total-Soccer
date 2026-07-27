type EntityNameRef = {
  name?: string | null;
  shortName?: string | null;
};

export function formatEntityName(ref?: EntityNameRef | null, useShortName = false) {
  if (!ref) {
    return '-';
  }

  if (useShortName) {
    return ref.shortName || ref.name || '-';
  }

  return ref.name || '-';
}
