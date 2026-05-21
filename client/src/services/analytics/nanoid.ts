// Minimal nano-id replacement (no dependency)
export const nanoid = (size = 12): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  const randomValues = crypto.getRandomValues(new Uint8Array(size));
  for (const v of randomValues) {
    id += chars[v % chars.length];
  }
  return id;
};
