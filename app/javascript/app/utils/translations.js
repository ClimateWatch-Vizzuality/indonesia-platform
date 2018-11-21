export const getTranslation = (content, slug, key) =>
  content && content[slug] && content[slug][key];
