import { __ } from '@wordpress/i18n';
import { Icon, ToolbarButton } from '@wordpress/components';
import { useState } from 'react';
import { BlockControls } from '@wordpress/block-editor';

export default function ImageControls() {
  const [inProgress, setInProgress] = useState(false);
  return (
    <BlockControls group="inline">
      <ToolbarButton
        label={__('Write Alt Text', 'ai-seo-tools')}
        icon="universal-access-alt"
        showTooltip
        disabled={inProgress}
        onClick={() => console.log('alt text clicked')}
      />
    </BlockControls>
  );
}
