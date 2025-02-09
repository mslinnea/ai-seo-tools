/**
 * Generate alt text for an image from a URL.
 * This version doesn't use React, so it can be used in the media library.
 */
import {getBase64Image, getMimeType} from "../../helpers/image-helpers";
import {getUserPrompt, getSystemPrompt} from "../prompts/altTextPrompt";
const {enums, store: aiStore, helpers} = window.aiServices.ai;
const AI_CAPABILITIES = [enums.AiCapability.MULTIMODAL_INPUT, enums.AiCapability.TEXT_GENERATION];

export default async function generateAltTextFromUrl(url: string, title: string|null|undefined, filename: string|null|undefined, aiService: string|null|undefined) {
	const service = window.wp.data.select(aiStore)?.getAvailableService({
		capabilities: AI_CAPABILITIES,
		slugs: [aiService],
	});

	if (!service || !url) {
		return;
	}

	try {
		const mimeType = getMimeType(url);
		const base64Image = await getBase64Image(url);

		let prompt = getUserPrompt(service);
		if (title?.length) {
			prompt += `\n\nImage Title: ${title}`;
		}
		if (filename?.length) {
			prompt += `\n\nFilename: ${filename}`;
		}

		const candidates = await service.generateText(
			{
				role: enums.ContentRole.USER,
				parts: [
					{
						text: prompt,
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
				feature: "ai-seo-tools-alt-text",
				capabilities: AI_CAPABILITIES,
			}
		);

		// Extract the generated alt text
		return helpers
			.getTextFromContents(helpers.getCandidateContents(candidates))
			.replaceAll('\n\n\n\n', '\n\n');

	} catch (error) {
		console.error("Error generating alt text:", error);
		return '';
	}
};




