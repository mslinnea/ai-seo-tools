import { __ } from '@wordpress/i18n';
import generateAltTextFromUrl from './generateAltTextFromUrl';
import Backbone from 'backbone';

declare const wp: any;

const View = (wp.media.view.Attachment.Details.TwoColumn || wp.media.view.Attachment.Details) as Backbone.View;

if (View) {
	const originalRender = View.prototype.render;
	let tries = 0;
	// @ts-ignore
	const AttachmentDetailsOverride = View.extend({
		render: function () {
			originalRender.call(this);

			const savedService = localStorage.getItem('seoToolsAltTextAIService') || 'openai';

			// Add dropdown and button
			this.$el
				.find('.setting[data-setting="alt"]')
				.after(
					'<span class="setting"><span class="name"></span>' +
					'<select class="alt-text-generator-selector" style="float: left; margin-right: 8px;">' +
					`<option value="openai" ${savedService === 'openai' ? 'selected' : ''}>OpenAI</option>` +
					`<option value="anthropic" ${savedService === 'anthropic' ? 'selected' : ''}>Claude</option>` +
					`<option value="google" ${savedService === 'google' ? 'selected' : ''}>Gemini</option>` +
					'</select>' +
					'<button class="button generate-alt-text">' +
					__('Generate Alt Text', 'ai-seo-tools') +
					'</button></span>'
				);

			this.$el.find('#attachment-details-two-column-alt-text').prop('rows', '10').css('height', 'auto');

			this.$el.find('.alt-text-generator-selector').on('change', (event: { target: HTMLSelectElement; }) => {
				const selectedService = (event.target as HTMLSelectElement).value;
				localStorage.setItem('seoToolsAltTextAIService', selectedService);
			});
		},

		events: {
			...View.prototype.events,
			'click .generate-alt-text': 'generateAltText',
		},

		async generateAltText(event: Event) {
			event.preventDefault();
			const button = this.$el.find('.generate-alt-text');
			const selectedService = this.$el.find('.alt-text-generator-selector').val(); // Get selected value

			button.text(__('Generating...', 'ai-seo-tools')).prop('disabled', true);
			const url = this.model.get('url');

			try {
				await (async () => {
					try {
						const altText = await generateAltTextFromUrl(url, this.model.get('title'), this.model.get('filename'), selectedService);
						tries++;
						if (altText) {
							console.log("Generated Alt Text:", altText);
							// Update the alt text field with the generated alt text
							this.$el.find('.setting[data-setting="alt"] textarea').val(altText);

							// Update the model
							this.model.set('alt', altText);
							this.model.save();
							button.text(__('Generate Alt Text', 'ai-seo-tools')).prop('disabled', false);
							// Re-render the view
							this.render();
						} else {
							console.log("No alt text could be generated for the provided image.");
							// todo: determine why alt text fails sometimes.
							if (tries < 2) {
								console.log("Retrying...");
								// sleep half a second
								await new Promise(r => setTimeout(r, 500));
								this.generateAltText(event);
							}
							button.text(__('Generate Alt Text', 'ai-seo-tools')).prop('disabled', false);
						}
					} catch (error) {
						console.error("Error occurred while generating alt text:", error);
					}
				})();

			} catch (error) {
				alert(JSON.stringify(error));
			}
		},
	});

	// Replace the default AttachmentDetails view with custom view.
	if (wp.media.view.Attachment.Details.TwoColumn) {
		wp.media.view.Attachment.Details.TwoColumn = AttachmentDetailsOverride;
	} else {
		wp.media.view.Attachment.Details = AttachmentDetailsOverride;
	}
}
