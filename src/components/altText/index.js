import { getMimeType, getBase64Image } from '../../helpers/image-helpers';

const { enums, helpers } = window.aiServices.ai;
const AI_CAPABILITIES = [enums.AiCapability.MULTIMODAL_INPUT, enums.AiCapability.TEXT_GENERATION];
import getPrompt from "../prompts/altTextPrompt";

export default async function generateAltText(props, setInProgress, service) {
  const { attributes, setAttributes } = props;

  // Check if AI service is available
  if (!service) {
    // eslint-disable-next-line no-console
    console.error('AI service is not available.');
    return;
  }

  // Check if image URL is available
  if (!attributes.url) {
    // eslint-disable-next-line no-console
    console.error('Image URL is missing.');
    return;
  }

  setInProgress(true);

  // Fetch the image data and prepare the request
  try {
    const mimeType = getMimeType(attributes.url);
    const base64Image = await getBase64Image(attributes.url);

    // Call the AI service to generate alt text
    const candidates = await service.generateText(
      {
        role: enums.ContentRole.USER,
        parts: [
          {
            text: getPrompt(),
          },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
      {
        feature: 'ai-seo-tools-alt-text',
        capabilities: AI_CAPABILITIES,
      },
    );

    // Extract the generated alt text
    const alt = helpers
      .getTextFromContents(helpers.getCandidateContents(candidates))
      .replaceAll('\n\n\n\n', '\n\n');

    // Set the alt text attribute
    setAttributes({ alt });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating alt text:', error);
  } finally {
    setInProgress(false);
  }
}
