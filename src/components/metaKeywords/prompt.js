const Mustache = require('mustache');

const metaKeywordsTemplate = `
  Generate a list of concise meta keywords for SEO based on the content below.
  Focus on the most relevant topics, themes, and keywords that capture the main points of the page,
  separating each keyword with a comma. Aim to keep the list brief, around 5-10 keywords.
  Title: {{postTitle}}
  Content: {{postContent}}
`;

export default function generateKeywordsPrompt(data) {
  return Mustache.render(metaKeywordsTemplate, data);
}
