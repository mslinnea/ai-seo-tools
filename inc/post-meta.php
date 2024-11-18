<?php
/**
 * Post Meta
 *
 * @package AISEOTools
 */

namespace LinSoftware\AISEOTools;

register_post_meta(
	'',
	'_meta_description',
	[
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	]
);

register_post_meta(
	'',
	'_meta_keywords',
	[
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	]
);
