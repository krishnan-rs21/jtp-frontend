export function formatContent(template, values) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key) => {
    if (!Object.hasOwn(values, key)) {
      throw new Error(`Missing value for content template: ${key}`);
    }

    return String(values[key]);
  });
}
