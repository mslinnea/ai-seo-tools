import { useState } from 'react';
import {
  Button,
  TextareaControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { usePostMetaValue } from '@alleyinteractive/block-editor-tools';

const { store: aiStore } = window.aiServices.ai;

function SettingsScreen() {
  const [metaDescription, setMetaDescription] = usePostMetaValue('meta_description');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const service = useSelect((select) => select(aiStore).getAvailableService(['text_generation']));
  const postContent = useSelect((select) => select('core/editor').getEditedPostAttribute('content'));
  const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'));
  if (!service) {
    return null;
  }

  const handleGenerateClick = async () => {
    setIsGeneratingDescription(true);
    let candidates;
    try {
      candidates = await service.generateText(
        {
          role: 'user',
          parts: [
            {
              text: `Create a brief meta description of the following content,
              suitable for search engines. This should be a short summary of the content on the page.
              Post Title: ${postTitle} Post Content ${postContent}`,
            },
          ],
        },
        {
          feature: 'add-meta-description-plugin',
          capabilities: ['text_generation'],
        },
      );
    } catch (error) {
      window.console.error(error);
      return;
    }

    const description = candidates[0].content.parts[0].text.replaceAll(
      '\n\n\n\n',
      '\n\n',
    );

    setMetaDescription(description);
    setIsGeneratingDescription(false);
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
      <Button
        isPrimary
        onClick={handleGenerateClick}
        disabled={isGeneratingDescription}
      >
        Generate
      </Button>
    </PluginDocumentSettingPanel>
  );
}

registerPlugin('ai-seo-tools', {
  render: SettingsScreen,
});
