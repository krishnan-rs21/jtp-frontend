export function publicAssetUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
