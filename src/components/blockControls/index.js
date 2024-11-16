import { addFilter } from '@wordpress/hooks';
import ImageControls from '../imageControls';

const addToolbar = (BlockEdit) => function(props) {
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
