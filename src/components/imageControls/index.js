import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import { useState } from 'react';
import { BlockControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import generateAltText from '../altText/index';

const { enums, store: aiStore } = window.aiServices.ai;
const AI_CAPABILITIES = [enums.AiCapability.MULTIMODAL_INPUT, enums.AiCapability.TEXT_GENERATION];

export default function ImageControls(props) {
  const [inProgress, setInProgress] = useState(false);
  const service = useSelect((select) => select(aiStore)
    .getAvailableService(
      { capabilities: AI_CAPABILITIES },
    ));

  const handleClick = async () => {
    setInProgress(true);
    await generateAltText(props, setInProgress, service);
    setInProgress(false);
  };

  return (
    <BlockControls group="inline">
      <ToolbarButton
        label={__('Write Alt Text', 'ai-seo-tools')}
        icon="universal-access-alt"
        showTooltip
        disabled={inProgress}
        onClick={handleClick}
      />
    </BlockControls>
  );
}
