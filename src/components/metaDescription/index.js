import { useState } from 'react';
import {
	Button,
	TextareaControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { usePostMetaValue } from '@alleyinteractive/block-editor-tools';
import generatePrompt from './prompt';

const { store: aiStore } = window.aiServices.ai;

function MetaDescriptionField() {
  const [metaDescription, setMetaDescription] = usePostMetaValue('_meta_description');
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
              text: generatePrompt({ postTitle, postContent }),
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
      setIsGeneratingDescription(false);
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
    <div className="meta-description-field">
      <TextareaControl
        label="Meta Description"
		rows={8}
        value={metaDescription}
        onChange={(value) => setMetaDescription(value)}
      />
      <Button
        isPrimary
        onClick={handleGenerateClick}
        disabled={isGeneratingDescription}
      >
        {isGeneratingDescription ? <Spinner /> : 'Generate'}
      </Button>
    </div>
  );
}

export default MetaDescriptionField;
