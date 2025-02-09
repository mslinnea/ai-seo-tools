export function getUserPrompt(service: string): string {
	const prompt = (window as any)?.aiSeoToolsSettings?.[service + "_user_prompt"];
	return prompt || "Create a brief description of what the following image shows, suitable as alternative text for screen readers.";
}

export function getSystemPrompt(service: string) {
	const prompt = (window as any)?.aiSeoToolsSettings?.[service + "_system_prompt"];
	return prompt || "You are an AI trained to generate accurate, concise, and descriptive alt text for images. Your goal is to create alt text that is informative, useful for visually impaired users, and follows best accessibility practices. Keep descriptions clear, avoid unnecessary details, and focus on the key subjects and context of the image. If the image contains text, transcribe it when relevant. Do not assume details that are not present in the image. Use neutral language and describe objectively.";
}
