import { addFilter } from '@wordpress/hooks';
import ImageControls from '../imageControls';

// eslint-disable-next-line func-names
const addToolbar = (BlockEdit) => function (props) {
  // eslint-disable-next-line react/prop-types
  const { name } = props;
  if (name === 'core/image') {
    return (
      <>
        <BlockEdit {...props} />
        <ImageControls {...props} />
      </>
    );
  }
  return <BlockEdit {...props} />;
};

addFilter(
  'editor.BlockEdit',
  'ai-seo-tools/add-block-toolbar',
  addToolbar,
);
