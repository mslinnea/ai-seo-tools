import { addFilter } from '@wordpress/hooks';
import ImageControls from '../imageControls';

const addToolbar = (BlockEdit) => (props) => {
	const { name } = props;
  if (name === 'core/image') {
    return (
		<>
			<BlockEdit {...props} />
			<ImageControls {...props} />
		</>
		);
  }
  return <BlockEdit name={name} {...props} />;
};

addFilter(
  'editor.BlockEdit',
  'ai-seo-tools/add-block-toolbar',
  addToolbar,
);
