<?php
/**
 * WP Head
 *
 * @package AISEOTools
 */

namespace LinSoftware\AISEOTools;

/**
 * Add meta tags to the head.
 *
 * @return void
 */
function add_meta_tags() {
	$meta_description = get_post_meta( get_the_ID(), '_meta_description', true );
	$meta_keywords    = get_post_meta( get_the_ID(), '_meta_keywords', true );

	if ( $meta_description ) {
		echo '<meta name="description" content="' . esc_attr( $meta_description ) . '">';
	}

	if ( $meta_keywords ) {
		echo '<meta name="keywords" content="' . esc_attr( $meta_keywords ) . '">';
	}
}
add_action( 'wp_head', __NAMESPACE__ . '\add_meta_tags' );
