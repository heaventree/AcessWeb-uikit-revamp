<?php
/**
 * Plugin Name: AccessWeb - WCAG Accessibility Checker
 * Plugin URI: https://accessweb.com/wordpress
 * Description: Automated WCAG compliance testing and monitoring for WordPress sites
 * Version: 1.0.0
 * Author: AccessWeb
 * Author URI: https://accessweb.com
 * Text Domain: accessweb
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ACCESSWEB_VERSION', '1.0.0');
define('ACCESSWEB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ACCESSWEB_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoloader
require_once ACCESSWEB_PLUGIN_DIR . 'includes/class-accessweb-autoloader.php';

/**
 * Main plugin class
 */
final class AccessWeb {
    /**
     * Single instance of the plugin
     */
    private static $instance = null;

    /**
     * Main AccessWeb Instance
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Plugin activation/deactivation
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        // Initialize plugin
        add_action('plugins_loaded', [$this, 'init']);

        // Admin hooks
        if (is_admin()) {
            add_action('admin_menu', [$this, 'add_admin_menu']);
            add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);
            add_action('admin_init', [$this, 'register_settings']);
        }

        // AJAX handlers
        add_action('wp_ajax_accessweb_start_scan', [$this, 'ajax_start_scan']);
        add_action('wp_ajax_accessweb_get_results', [$this, 'ajax_get_results']);
        add_action('wp_ajax_accessweb_apply_fixes', [$this, 'ajax_apply_fixes']);
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Create necessary database tables
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/class-accessweb-activator.php';
        AccessWeb_Activator::activate();
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Cleanup if necessary
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/class-accessweb-deactivator.php';
        AccessWeb_Deactivator::deactivate();
    }

    /**
     * Initialize plugin
     */
    public function init() {
        // Load translations
        load_plugin_textdomain('accessweb', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Initialize components
        $this->init_components();
    }

    /**
     * Initialize plugin components
     */
    private function init_components() {
        // Load API client
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/api/class-accessweb-api-client.php';

        // Load scanner
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/scanner/class-accessweb-scanner.php';

        // Load auto-fixer
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/fixer/class-accessweb-auto-fixer.php';

        // Load monitor
        require_once ACCESSWEB_PLUGIN_DIR . 'includes/monitor/class-accessweb-monitor.php';
    }

    /**
     * Add admin menu items
     */
    public function add_admin_menu() {
        add_menu_page(
            __('AccessWeb', 'accessweb'),
            __('AccessWeb', 'accessweb'),
            'manage_options',
            'accessweb',
            [$this, 'render_admin_page'],
            'dashicons-universal-access-alt',
            100
        );

        add_submenu_page(
            'accessweb',
            __('Dashboard', 'accessweb'),
            __('Dashboard', 'accessweb'),
            'manage_options',
            'accessweb'
        );

        add_submenu_page(
            'accessweb',
            __('Scan', 'accessweb'),
            __('Scan', 'accessweb'),
            'manage_options',
            'accessweb-scan',
            [$this, 'render_scan_page']
        );

        add_submenu_page(
            'accessweb',
            __('Reports', 'accessweb'),
            __('Reports', 'accessweb'),
            'manage_options',
            'accessweb-reports',
            [$this, 'render_reports_page']
        );

        add_submenu_page(
            'accessweb',
            __('Settings', 'accessweb'),
            __('Settings', 'accessweb'),
            'manage_options',
            'accessweb-settings',
            [$this, 'render_settings_page']
        );
    }

    /**
     * Register plugin settings
     */
    public function register_settings() {
        register_setting('accessweb_settings', 'accessweb_api_key');
        register_setting('accessweb_settings', 'accessweb_scan_frequency');
        register_setting('accessweb_settings', 'accessweb_auto_fix');
        register_setting('accessweb_settings', 'accessweb_notify_admin');
        register_setting('accessweb_settings', 'accessweb_excluded_paths');
    }

    /**
     * Enqueue admin scripts and styles
     */
    public function admin_enqueue_scripts($hook) {
        if (strpos($hook, 'accessweb') === false) {
            return;
        }

        // Enqueue React app
        wp_enqueue_script(
            'accessweb-admin',
            ACCESSWEB_PLUGIN_URL . 'admin/build/static/js/main.js',
            [],
            ACCESSWEB_VERSION,
            true
        );

        wp_enqueue_style(
            'accessweb-admin',
            ACCESSWEB_PLUGIN_URL . 'admin/build/static/css/main.css',
            [],
            ACCESSWEB_VERSION
        );

        // Localize script
        wp_localize_script('accessweb-admin', 'accesswebAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('accessweb-admin'),
            'apiUrl' => rest_url('accessweb/v1'),
            'siteUrl' => get_site_url(),
            'pluginUrl' => ACCESSWEB_PLUGIN_URL
        ]);
    }

    /**
     * Render admin pages
     */
    public function render_admin_page() {
        require_once ACCESSWEB_PLUGIN_DIR . 'admin/templates/dashboard.php';
    }

    public function render_scan_page() {
        require_once ACCESSWEB_PLUGIN_DIR . 'admin/templates/scan.php';
    }

    public function render_reports_page() {
        require_once ACCESSWEB_PLUGIN_DIR . 'admin/templates/reports.php';
    }

    public function render_settings_page() {
        require_once ACCESSWEB_PLUGIN_DIR . 'admin/templates/settings.php';
    }

    /**
     * AJAX handlers
     */
    public function ajax_start_scan() {
        check_ajax_referer('accessweb-admin', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $scanner = new AccessWeb_Scanner();
        $result = $scanner->start_scan();

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }

        wp_send_json_success($result);
    }

    public function ajax_get_results() {
        check_ajax_referer('accessweb-admin', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $scan_id = isset($_POST['scan_id']) ? sanitize_text_field($_POST['scan_id']) : '';
        if (empty($scan_id)) {
            wp_send_json_error('Invalid scan ID');
        }

        $scanner = new AccessWeb_Scanner();
        $result = $scanner->get_results($scan_id);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }

        wp_send_json_success($result);
    }

    public function ajax_apply_fixes() {
        check_ajax_referer('accessweb-admin', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $scan_id = isset($_POST['scan_id']) ? sanitize_text_field($_POST['scan_id']) : '';
        if (empty($scan_id)) {
            wp_send_json_error('Invalid scan ID');
        }

        $fixer = new AccessWeb_Auto_Fixer();
        $result = $fixer->apply_fixes($scan_id);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }

        wp_send_json_success($result);
    }
}

// Initialize the plugin
function AccessWeb() {
    return AccessWeb::instance();
}

// Start the plugin
AccessWeb();