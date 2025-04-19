<?php
/**
 * AccessWeb API Client
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_API_Client {
    /**
     * API endpoint
     */
    private $api_url = 'https://api.accessweb.com/v1';

    /**
     * API key
     */
    private $api_key = '';

    /**
     * Constructor
     */
    public function __construct() {
        $this->api_key = get_option('accessweb_api_key', '');
    }

    /**
     * Make API request
     */
    private function request($endpoint, $method = 'GET', $body = null) {
        $args = [
            'method' => $method,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
                'User-Agent' => 'AccessWeb WordPress Plugin/' . ACCESSWEB_VERSION
            ],
            'timeout' => 30
        ];

        if ($body) {
            $args['body'] = json_encode($body);
        }

        $response = wp_remote_request($this->api_url . $endpoint, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);

        if ($code !== 200) {
            return new WP_Error(
                'api_error',
                isset($body['message']) ? $body['message'] : 'API request failed',
                ['status' => $code]
            );
        }

        return $body;
    }

    /**
     * Start a new scan
     */
    public function start_scan($url) {
        return $this->request('/scan', 'POST', [
            'url' => $url,
            'integration' => 'wordpress'
        ]);
    }

    /**
     * Get scan results
     */
    public function get_scan_results($scan_id) {
        return $this->request('/scan/' . $scan_id);
    }

    /**
     * Apply auto-fixes
     */
    public function apply_fixes($scan_id) {
        return $this->request('/scan/' . $scan_id . '/fix', 'POST');
    }

    /**
     * Validate API key
     */
    public function validate_api_key() {
        return $this->request('/validate');
    }
}