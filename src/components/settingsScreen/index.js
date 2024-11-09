import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import {
  __experimentalSpacer as Spacer,
} from '@wordpress/components';
import MetaDescriptionField from '../metaDescription/index';
import MetaKeywordsField from '../metaKeywords/index';

function SettingsScreen() {
  return (
    <PluginDocumentSettingPanel
      name="ai-seo-tools"
      title="SEO Tools"
      className="ai-seo-tools-panel"
      collapsed={false}
    >
      <MetaDescriptionField />
      <Spacer />
      <MetaKeywordsField />
    </PluginDocumentSettingPanel>
  );
}

registerPlugin('ai-seo-tools', {
  render: SettingsScreen,
});
