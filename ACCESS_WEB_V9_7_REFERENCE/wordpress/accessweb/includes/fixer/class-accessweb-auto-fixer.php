<?php
/**
 * AccessWeb Auto Fixer
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_Auto_Fixer {
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
     * Apply fixes for a scan
     */
    public function apply_fixes($scan_id) {
        // Check if auto-fix is enabled
        if (!get_option('accessweb_auto_fix', false)) {
            return new WP_Error('auto_fix_disabled', 'Auto-fix is disabled in settings');
        }

        // Get fixes from API
        $result = $this->api_client->apply_fixes($scan_id);

        if (is_wp_error($result)) {
            return $result;
        }

        // Apply fixes to the site
        foreach ($result['fixes'] as $fix) {
            switch ($fix['type']) {
                case 'theme':
                    $this->apply_theme_fix($fix);
                    break;
                case 'content':
                    $this->apply_content_fix($fix);
                    break;
                case 'plugin':
                    $this->apply_plugin_fix($fix);
                    break;
            }
        }

        return $result;
    }

    /**
     * Apply theme fixes
     */
    private function apply_theme_fix($fix) {
        // Get theme file path
        $theme_file = get_theme_root() . '/' . get_template() . '/' . $fix['file'];

        // Backup original file
        $backup_file = $theme_file . '.bak';
        copy($theme_file, $backup_file);

        // Apply fix
        file_put_contents($theme_file, $fix['content']);
    }

    /**
     * Apply content fixes
     */
    private function apply_content_fix($fix) {
        // Get post
        $post = get_post($fix['post_id']);

        if (!$post) {
            return;
        }

        // Update post content
        wp_update_post([
            'ID' => $post->ID,
            'post_content' => $fix['content']
        ]);
    }

    /**
     * Apply plugin fixes
     */
    private function apply_plugin_fix($fix) {
        // Get plugin file path
        $plugin_file = WP_PLUGIN_DIR . '/' . $fix['file'];

        // Backup original file
        $backup_file = $plugin_file . '.bak';
        copy($plugin_file, $backup_file);

        // Apply fix
        file_put_contents($plugin_file, $fix['content']);
    }
}