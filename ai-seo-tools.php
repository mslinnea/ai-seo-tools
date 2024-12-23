<?php
/**
 * Plugin Name: AI SEO Tools
 * Plugin URI: https://github.com/mslinnea/ai-seo-tools
 * Description: A plugin to enhance SEO using AI.
 * Version: 0.0.1
 * Author: Linnea Huxford
 * Author URI: https://linsoftware.com
 * License: GPL-3.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: ai-seo-tools
 * Requires Plugins: ai-services
 */

namespace LinSoftware\AISEOTools;

require_once __DIR__ . '/inc/post-meta.php';
require_once __DIR__ . '/inc/wp-head.php';

add_action(
	'enqueue_block_editor_assets',
	static function () {
		// Bail if the AI Services plugin is not active.
		if ( ! function_exists( 'ai_services' ) ) {
			return;
		}

		$asset_metadata                   = require plugin_dir_path( __FILE__ ) . 'build/scripts.asset.php';
		$asset_metadata['dependencies'][] = 'ais-ai-store';

		wp_enqueue_script(
			'ai-seo-tools',
			plugin_dir_url( __FILE__ ) . 'build/scripts.js',
			$asset_metadata['dependencies'],
			$asset_metadata['version'],

			['strategy' => 'defer' ]
		);
	}
);

