<?php
/**
 *
 * @package AISEOTools
 */

namespace LinSoftware\AISEOTools;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get available AI services.
 *
 * @return string[]
 */
function get_available_api_services(): array {
	return ai_services()->get_registered_service_slugs();
}

/**
 * Is Service Available?
 *
 * @param string $service Service slug.
 *
 * @return bool
 */
function is_api_service_available( string $service ): bool {
	return ai_services()->is_service_available( $service );
}

/**
 * Get available models.
 *
 * @param string $service Service slug.
 *
 * @return string[]
 */
function get_available_models( string $service ) {
	$service = ai_services()->get_available_service( $service );

	return array_keys( $service->list_models() );
}

/**
 * Get Default Model.
 * @todo Make this dynamic.
 * Automatically look for model with MULTIMODAL_INPUT and TEXT_GENERATION input.
 *
 * @param string $service
 *
 * @return string
 */
function get_default_model( string $service ): string {
	return match ( $service ) {
		'openai' => 'gpt-4o',
		'anthropic' => 'claude-3-5-sonnet-20240620',
		'google' => 'gemini-2.0-flash',
	};
}

/**
 * Register settings.
 */
function ai_seo_register_settings() {
	$services = get_available_api_services();

	add_option( 'ai_seo_tools_settings', [] );
	register_setting( 'ai_seo_tools_group', 'ai_seo_tools_settings' );

	add_settings_section(
		'ai_seo_main_section',
		'General Settings',
		null,
		'ai_seo_tools'
	);

	foreach ( $services as $service ) {
		add_settings_section(
			"ai_seo_{$service}_section",
			ucfirst( $service ) . ' Settings',
			null,
			'ai_seo_tools'
		);

		add_settings_field(
			"{$service}_system_prompt",
			'System Prompt',
			__NAMESPACE__ . '\ai_seo_text_field',
			'ai_seo_tools',
			"ai_seo_{$service}_section",
			[
				'id'      => "{$service}_system_prompt",
				'label'   => 'Enter the system prompt for alt text generation',
				'service' => $service
			]
		);

		add_settings_field(
			"{$service}_user_prompt",
			'User Prompt',
			__NAMESPACE__ . '\ai_seo_text_field',
			'ai_seo_tools',
			"ai_seo_{$service}_section",
			[
				'id'      => "{$service}_user_prompt",
				'label'   => 'Enter the user prompt for alt text generation',
				'service' => $service
			]
		);

		add_settings_field(
			"{$service}_model",
			'Preferred Model',
			__NAMESPACE__ . '\ai_seo_model_dropdown',
			'ai_seo_tools',
			"ai_seo_{$service}_section",
			[
				'id'      => "{$service}_model",
				'service' => $service
			]
		);
	}

	add_settings_field(
		'preferred_service',
		'Preferred AI Service',
		__NAMESPACE__ . '\ai_seo_service_dropdown',
		'ai_seo_tools',
		'ai_seo_main_section'
	);
}

add_action( 'admin_init', __NAMESPACE__ . '\ai_seo_register_settings' );

/**
 * Render fields.
 *
 * @param array $args Args.
 */
function ai_seo_text_field( $args ) {
	$options  = get_option( 'ai_seo_tools_settings' );
	$value    = $options[ $args['id'] ] ?? '';
	$disabled = is_api_service_available( $args['service'] ) ? '' : 'disabled';
	?>
	<textarea id="<?php echo esc_attr( $args['id'] ); ?>"
			  name="ai_seo_tools_settings[<?php echo esc_attr( $args['id'] ); ?>]"
			  rows="10"
			  class="regular-text" <?php echo $disabled; ?>><?php echo esc_textarea( $value ); ?></textarea>
	<?php
}

/**
 * Render model dropdown.
 *
 * @param $args
 *
 * @return void
 */
function ai_seo_model_dropdown( $args ) {
	$options        = get_option( 'ai_seo_tools_settings' );
	$selected_model = $options[ $args['id'] ] ?? get_default_model( $args['service'] );
	$models         = get_available_models( $args['service'] );
	$disabled       = is_api_service_available( $args['service'] ) ? '' : 'disabled';

	echo "<select id='{$args['id']}' name='ai_seo_tools_settings[{$args['id']}]' $disabled>";
	foreach ( $models as $model ) {
		$selected = ( $selected_model === $model ) ? 'selected' : '';
		echo "<option value='$model' $selected>$model</option>";
	}
	echo "</select>";
}

/**
 * Render AI Services Dropdown
 */
function ai_seo_service_dropdown() {
	$options           = get_option( 'ai_seo_tools_settings' );
	$preferred_service = $options['preferred_service'] ?? '';
	$services          = get_available_api_services();

	echo "<select id='preferred_service' name='ai_seo_tools_settings[preferred_service]'>";
	foreach ( $services as $service ) {
		$selected = ( $preferred_service === $service ) ? 'selected' : '';
		echo "<option value='$service' $selected>$service</option>";
	}
	echo "</select>";
}

/**
 * Add Menu Page
 */
function ai_seo_tools_menu() {
	add_options_page(
		'AI SEO Tools Alt Text',
		'AI SEO Tools',
		'manage_options',
		'ai_seo_tools',
		__NAMESPACE__ . '\ai_seo_tools_page_html'
	);
}

add_action( 'admin_menu', __NAMESPACE__ . '\ai_seo_tools_menu' );

/**
 * Settings Page HTML.
 */
function ai_seo_tools_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	echo "<div class='wrap'>";
	echo "<h1>AI SEO Tools Alt Text</h1>";
	echo "<form action='options.php' method='post'>";
	settings_fields( 'ai_seo_tools_group' );
	do_settings_sections( 'ai_seo_tools' );
	submit_button();
	echo "</form></div>";
}
