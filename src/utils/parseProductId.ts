export function parseProductId(id: unknown): number | null {
  if (typeof id !== "string") return null;

  const num = Number(id);

  if (!Number.isInteger(num) || num <= 0) {
    return null;
  }

  return num;
}