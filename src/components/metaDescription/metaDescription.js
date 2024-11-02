import { useState, useEffect } from 'react';
import {
	createSlotFill,
	Button,
	ButtonGroup,
	TextareaControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';


const {store: aiStore} = window.aiServices.ai;

const {Fill, Slot} = createSlotFill('MetaDescription');
import apiFetch from '@wordpress/api-fetch';

const SettingsScreen = () => {
	const [metaDescription, setMetaDescription] = useState('');
	const service = useSelect((select) =>
		select(aiStore).getAvailableService( ['text_generation'])
	);
	const postContent = useSelect((select) =>
		select('core/editor').getEditedPostAttribute('content')
	);
	const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'));
	useEffect(() => {
		// Fetch the existing meta description from the server when the component mounts
		apiFetch({path: '/wp/v2/settings'}).then((settings) => {
			setMetaDescription(settings.meta_description || '');
		});
	}, []);
	if (!service) {
		return null;
	}
	const saveMetaDescription = () => {
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: {meta_description: metaDescription},
		}).then(() => {
			alert('Meta description saved!');
		});
	};

	const handleGenerateClick = async () => {

		let candidates;
		try {
			candidates = await service.generateText(
				{
					role: 'user',
					parts: [
						{
							text: 'Create a brief meta description of the following content, suitable for search' +
								' engines. This should be a short summary of the content on the page.' +
								'Post Title: ' + postTitle +
								'Post Content ' + postContent,
						},
					],
				},
				{
					feature: 'add-meta-description-plugin',
					capabilities:  [ 'text_generation' ],
				}
			);
		} catch (error) {
			window.console.error(error);
			return;
		}

		console.log(candidates);
		const description = candidates[0].content.parts[0].text.replaceAll(
			'\n\n\n\n',
			'\n\n'
		);

		setMetaDescription(description);
	};

	return (
		<PluginDocumentSettingPanel
			name="meta-description"
			title="Meta Description"
			className="ai-seo-tools-meta-description"
		>

			<TextareaControl
				label="Meta Description"
				value={metaDescription}
				onChange={(value) => setMetaDescription(value)}
			/>
			<ButtonGroup>
				<Button isPrimary onClick={saveMetaDescription}>Save</Button>
				<Button isSecondary={true} onClick={handleGenerateClick}>Generate</Button>
			</ButtonGroup>


		</PluginDocumentSettingPanel>
	);
}


registerPlugin('ai-seo-tools', {
	render: SettingsScreen,
});

