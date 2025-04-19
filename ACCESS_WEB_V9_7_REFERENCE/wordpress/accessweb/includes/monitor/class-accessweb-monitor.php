<?php
/**
 * AccessWeb Monitor
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_Monitor {
    /**
     * API client instance
     */
    private $api_client;

    /**
     * Constructor
     */
    public function __construct() {
        $this->api_client = new AccessWeb_API_Client();
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Add monitoring script to footer
        add_action('wp_footer', [$this, 'add_monitoring_script']);

        // Add badge if enabled
        if (get_option('accessweb_show_badge', true)) {
            add_action('wp_footer', [$this, 'add_badge']);
        }
    }

    /**
     * Add monitoring script
     */
    public function add_monitoring_script() {
        $api_key = get_option('accessweb_api_key', '');
        if (empty($api_key)) {
            return;
        }

        echo $this->api_client->get_monitoring_script($api_key);
    }

    /**
     * Add compliance badge
     */
    public function add_badge() {
        $api_key = get_option('accessweb_api_key', '');
        if (empty($api_key)) {
            return;
        }

        echo $this->api_client->get_badge_script($api_key);
    }

    /**
     * Check if monitoring is enabled
     */
    public function is_monitoring_enabled() {
        return !empty(get_option('accessweb_api_key', ''));
    }
}