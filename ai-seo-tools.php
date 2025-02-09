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
 *
 * @package AISEOTools
 */

namespace LinSoftware\AISEOTools;

require_once __DIR__ . '/inc/post-meta.php';
require_once __DIR__ . '/inc/wp-head.php';
require_once __DIR__ . '/inc/admin/ai-seo-tools-alt-text-settings-page.php';

// Enqueue scripts in both block editor and other admin pages like media library
// todo: possibly separate out media library enqueue.
add_action(
	'admin_enqueue_scripts',
	static function () {
		// Bail if the AI Services plugin is not active.
		if ( ! function_exists( 'ai_services' ) ) {
			return;
		}

		$asset_metadata                   = require plugin_dir_path( __FILE__ ) . 'build/scripts.asset.php';
		$asset_metadata['dependencies'][] = 'ais-ai-store';
		$asset_metadata['version']        = filemtime( plugin_dir_path( __FILE__ ) . 'build/scripts.js' );

		wp_enqueue_script(
			'ai-seo-tools',
			plugin_dir_url( __FILE__ ) . 'build/scripts.js',
			$asset_metadata['dependencies'],
			$asset_metadata['version'],
			[ 'strategy' => 'defer' ]
		);
		$settings = wp_json_encode( get_option( 'ai_seo_tools_settings' ) );
		$script = <<<SCRIPT
		window.aiSeoToolsSettings = {$settings}
SCRIPT;
		wp_add_inline_script( 'ai-seo-tools', $script );
	}
);


add_filter(
	'ai_services_model_params',
	function ( $params ) {
		/**
		 * @todo update this to use the service specific system instruction
		 * depends on https://github.com/felixarntz/ai-services/pull/23
		 */
		if ( 'ai-seo-tools-alt-text' === $params['feature'] ) {
			$params['systemInstruction'] = "You are an AI trained to generate accurate, concise, and descriptive alt text for images. Your goal is to create alt text that is informative, useful for visually impaired users, and follows best accessibility practices. Keep descriptions clear, avoid unnecessary details, and focus on the key subjects and context of the image. If the image contains text, transcribe it when relevant. Do not assume details that are not present in the image. Use neutral language and describe objectively.";
		}
		return $params;
	},
	10
);
