import {__} from '@wordpress/i18n';
import generateAltTextFromUrl from './generateAltTextFromUrl';

declare const wp: any;

const View: any = wp.media.view.Attachment.Details.TwoColumn || wp.media.view.Attachment.Details;

if (View) {
	const originalRender = View.prototype.render;
	let tries = 0;
	const AttachmentDetailsOverride = View.extend({
		render: function () {
			originalRender.call(this);
			this.$el
				.find('.setting[data-setting="alt"]')
				.after(
					'<span class="setting"><span class="name"></span>' +
					'<button style="float: right" class="button generate-alt-text">' +
					__('Generate Alt', 'ai-seo-tools') +
					'</button></span>'
				);
		},

		events: {
			...View.prototype.events,
			'click .generate-alt-text': 'generateAltText',
		},

		async generateAltText(event: Event) {
			event.preventDefault();
			const button = this.$el.find('.generate-alt-text');
			button.text(__('Generating...', 'ai-seo-tools')).prop('disabled', true);
			const url = this.model.get('url');

			try {
				(async () => {
					try {
						const altText = await generateAltTextFromUrl(url);
						tries++;
						if (altText) {
							console.log("Generated Alt Text:", altText);
							// Update the alt text field with the generated alt text
							this.$el.find('.setting[data-setting="alt"] textarea').val(altText);

							// Update the model
							this.model.set('alt', altText);
							this.model.save();
							button.text(__('Generate Alt', 'ai-seo-tools')).prop('disabled', false);
							// Re-render the view
							this.render();
						} else {
							console.log("No alt text could be generated for the provided image.");
							// todo: determine why alt text fails sometimes.
							if (tries<2) {
								console.log("Retrying...");
								// sleep half a second
								await new Promise(r => setTimeout(r, 500));
								this.generateAltText(event);
							}
							button.text(__('Generate Alt', 'ai-seo-tools')).prop('disabled', false);
						}
					} catch (error) {
						console.error("Error occurred while generating alt text:", error);
					}
				})();

			} catch (error) {
				alert(JSON.stringify(error));
			} finally {

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
