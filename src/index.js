import {useState, useEffect} from 'react';
import {
	createSlotFill,
	Button,
	Panel,
	PanelBody,
	PanelRow,
	TextControl
} from '@wordpress/components';
import {registerPlugin} from '@wordpress/plugins';
import {PluginDocumentSettingPanel} from '@wordpress/editor';

const {Fill, Slot} = createSlotFill('MetaDescription');
import apiFetch from '@wordpress/api-fetch';

const SettingsScreen = () => {
	console.log('SettingsScreen');
	const [metaDescription, setMetaDescription] = useState('');

	useEffect(() => {
		// Fetch the existing meta description from the server when the component mounts
		apiFetch({path: '/wp/v2/settings'}).then((settings) => {
			setMetaDescription(settings.meta_description || '');
		});
	}, []);

	const saveMetaDescription = () => {
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: {meta_description: metaDescription},
		}).then(() => {
			alert('Meta description saved!');
		});
	};

	return (
		<PluginDocumentSettingPanel
			name="meta-description"
			title="Meta Description"
			className="ai-seo-tools-meta-description"
		>

			<TextControl
				label="Meta Description"
				value={metaDescription}
				onChange={(value) => setMetaDescription(value)}
			/>
			<button onClick={saveMetaDescription}>Save</button>


		</PluginDocumentSettingPanel>
	);
}


registerPlugin('ai-seo-tools', {
	render: SettingsScreen,
});

console.log('test');
