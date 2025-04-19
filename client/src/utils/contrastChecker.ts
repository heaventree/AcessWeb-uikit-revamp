/**
 * WCAG Color Contrast Checker
 * 
 * This utility helps ensure our color combinations meet WCAG 2.1 accessibility standards.
 * - WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text
 * - WCAG AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text
 * 
 * Based on the contrast checking algorithm from W3C: 
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

/**
 * Converts a hex color to RGB values
 * @param hex Hex color code (with or without #)
 * @returns RGB values object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Handle shorthand hex (#fff -> #ffffff)
  const processedHex = cleanHex.length === 3 
    ? cleanHex.split('').map(c => c + c).join('') 
    : cleanHex;
  
  // Parse hex values to RGB
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(processedHex);
  
  if (!result) {
    console.error(`Invalid hex color: ${hex}`);
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Converts an RGB color to a luminance value
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Luminance value
 */
export function rgbToLuminance(r: number, g: number, b: number): number {
  // Convert RGB values to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Convert sRGB values to linear RGB
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the contrast ratio between two colors
 * @param color1 First color in hex (e.g., #FFFFFF)
 * @param color2 Second color in hex (e.g., #000000)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Convert colors to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  // Calculate luminance values
  const luminance1 = rgbToLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = rgbToLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  // Determine lighter and darker luminance
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  // Calculate contrast ratio
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG contrast requirements
 * @param foreground Foreground color (text) in hex
 * @param background Background color in hex
 * @param isLargeText Whether the text is large (≥18pt or ≥14pt bold)
 * @returns Object with contrast ratio and compliance results
 */
export function checkWCAGCompliance(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'Fail' | 'AA' | 'AAA';
} {
  const ratio = getContrastRatio(foreground, background);
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;
  
  const passesAA = ratio >= aaThreshold;
  const passesAAA = ratio >= aaaThreshold;
  
  let level: 'Fail' | 'AA' | 'AAA' = 'Fail';
  if (passesAAA) level = 'AAA';
  else if (passesAA) level = 'AA';
  
  return {
    ratio,
    passesAA,
    passesAAA,
    level
  };
}

/**
 * Determines if text is readable on a background
 * @param foreground Foreground color in hex
 * @param background Background color in hex
 * @param size Font size in pixels
 * @param isBold Whether the font is bold
 * @returns Whether the text is readable according to WCAG AA standards
 */
export function isReadable(
  foreground: string,
  background: string,
  size: number = 16, // Default font size in pixels
  isBold: boolean = false
): boolean {
  // Determine if text is "large" according to WCAG
  // Large text is defined as 18pt (24px) or 14pt (18.66px) bold
  const isLargeText = size >= 24 || (size >= 18.66 && isBold);
  
  // Check WCAG AA compliance
  const { passesAA } = checkWCAGCompliance(foreground, background, isLargeText);
  
  return passesAA;
}

/**
 * Get a text color (black or white) that provides the best contrast with a background color
 * @param backgroundColor Background color in hex
 * @returns White (#FFFFFF) or black (#000000) for optimal contrast
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const luminance = rgbToLuminance(rgb.r, rgb.g, rgb.b);
  
  // Use white text on dark backgrounds, black text on light backgrounds
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
}

/**
 * Format a contrast ratio as a readable string
 * @param ratio Contrast ratio
 * @returns Formatted string (e.g., "4.5:1")
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}