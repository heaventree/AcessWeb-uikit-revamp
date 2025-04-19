<?php
/**
 * AccessWeb Autoloader
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_Autoloader {
    /**
     * Path to the includes directory
     */
    private $include_path = '';

    /**
     * The Constructor
     */
    public function __construct() {
        if (function_exists('__autoload')) {
            spl_autoload_register('__autoload');
        }

        spl_autoload_register([$this, 'autoload']);

        $this->include_path = untrailingslashit(plugin_dir_path(ACCESSWEB_PLUGIN_DIR)) . '/includes/';
    }

    /**
     * Take a class name and turn it into a file name
     */
    private function get_file_name_from_class($class) {
        return 'class-' . str_replace('_', '-', strtolower($class)) . '.php';
    }

    /**
     * Include a class file
     */
    private function load_file($path) {
        if ($path && is_readable($path)) {
            include_once $path;
            return true;
        }
        return false;
    }

    /**
     * Auto-load AccessWeb classes
     */
    public function autoload($class) {
        $class = strtolower($class);

        if (0 !== strpos($class, 'accessweb_')) {
            return;
        }

        $file = $this->get_file_name_from_class($class);
        $path = '';

        if (strpos($class, 'accessweb_api_') === 0) {
            $path = $this->include_path . 'api/';
        } elseif (strpos($class, 'accessweb_scanner_') === 0) {
            $path = $this->include_path . 'scanner/';
        } elseif (strpos($class, 'accessweb_fixer_') === 0) {
            $path = $this->include_path . 'fixer/';
        } elseif (strpos($class, 'accessweb_monitor_') === 0) {
            $path = $this->include_path . 'monitor/';
        }

        if (empty($path) || !$this->load_file($path . $file)) {
            $this->load_file($this->include_path . $file);
        }
    }
}