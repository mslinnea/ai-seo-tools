const Mustache = require('mustache');

const template = `
  Generate a concise, engaging meta description optimized for search engines.
  The description should summarize the key points, incorporate relevant keywords naturally,
  and entice users to click. Limit to around 155 characters.
  Title: {{postTitle}}
  Content: {{postContent}}
`;

// Export a function to render the prompt with given data
export default function generatePrompt(data) {
  return Mustache.render(template, data);
}
