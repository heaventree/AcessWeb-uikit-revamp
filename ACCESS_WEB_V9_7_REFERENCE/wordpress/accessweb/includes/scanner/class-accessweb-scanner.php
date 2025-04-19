<?php
/**
 * AccessWeb Scanner
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_Scanner {
    /**
     * API client instance
     */
    private $api_client;

    /**
     * Constructor
     */
    public function __construct() {
        $this->api_client = new AccessWeb_API_Client();
    }

    /**
     * Start a new scan
     */
    public function start_scan() {
        // Get site URL
        $url = get_site_url();

        // Start scan via API
        $result = $this->api_client->start_scan($url);

        if (is_wp_error($result)) {
            return $result;
        }

        // Store scan ID
        update_option('accessweb_last_scan_id', $result['scan_id']);
        update_option('accessweb_last_scan_time', time());

        return $result;
    }

    /**
     * Get scan results
     */
    public function get_results($scan_id) {
        return $this->api_client->get_scan_results($scan_id);
    }

    /**
     * Schedule automatic scans
     */
    public function schedule_scan() {
        $frequency = get_option('accessweb_scan_frequency', 'weekly');

        if ($frequency === 'manual') {
            return;
        }

        if (!wp_next_scheduled('accessweb_scheduled_scan')) {
            wp_schedule_event(
                time(),
                $frequency,
                'accessweb_scheduled_scan'
            );
        }
    }

    /**
     * Clear scheduled scans
     */
    public function clear_scheduled_scan() {
        wp_clear_scheduled_hook('accessweb_scheduled_scan');
    }
}