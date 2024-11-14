import { useState } from 'react';
import {
  Button,
  TextareaControl,
  Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { usePostMetaValue } from '@alleyinteractive/block-editor-tools';
import generateKeywordsPrompt from './prompt';

const { store: aiStore, helpers: aiHelpers } = window.aiServices.ai;

function MetaKeywordsField() {
  const [metaKeywords, setMetaKeywords] = usePostMetaValue('_meta_keywords');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const service = useSelect(
    (select) => select(aiStore)
      .getAvailableService(
        { capabilities: ['text_generation'] },
      ),
    [],
  );
  const postContent = useSelect(
    (select) => select('core/editor')
      .getEditedPostAttribute('content'),
    [],
  );
  const postTitle = useSelect(
    (select) => select('core/editor')
      .getEditedPostAttribute('title'),
    [],
  );
  if (!service) {
    return null;
  }

  const handleGenerateKeywordsClick = async () => {
    setIsGeneratingKeywords(true);
    let candidates;
    try {
      candidates = await service.generateText(
        generateKeywordsPrompt({ postTitle, postContent }),
        {
          feature: 'add-meta-keywords-plugin',
          capabilities: ['text_generation'],
        },
      );
    } catch (error) {
      window.console.error(error);
      setIsGeneratingKeywords(false);
      return;
    }

    const keywords = aiHelpers.getTextFromContents(
      aiHelpers.getCandidateContents(candidates),
    );

    setMetaKeywords(keywords);
    setIsGeneratingKeywords(false);
  };

  return (
    <div className="meta-keyword-field">
      <TextareaControl
        label="Meta Keywords"
        rows={8}
        value={metaKeywords}
        onChange={(value) => setMetaKeywords(value)}
      />
      <Button
        isPrimary
        onClick={handleGenerateKeywordsClick}
        disabled={isGeneratingKeywords}
      >
        {isGeneratingKeywords ? <Spinner /> : 'Generate'}
      </Button>
    </div>
  );
}

export default MetaKeywordsField;
