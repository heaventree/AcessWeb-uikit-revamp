import React, { useState, useRef } from 'react';
import { RefreshCw, Copy, Info, Check, FileText, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoadingSpinner } from './LoadingSpinner';

interface ColorCombination {
  background: string;
  text: string;
  name: string;
  ratio: number;
  wcagLevel: 'AAA' | 'AA' | 'Fail';
  isBaseColor?: boolean;
}

// Color harmony type
type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochromatic' | 'tetradic' | 'square' | 'all';

// Color utility functions
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(value => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio: number, isLargeText: boolean = false, isUI: boolean = false): 'AAA' | 'AA' | 'Fail' {
  // WCAG 2.2 maintains the same contrast requirements as 2.1, but adds specific requirements
  // for focus indicators and other UI components which are handled elsewhere
  
  // For regular text
  if (!isLargeText && !isUI) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
  
  // For large text
  if (isLargeText && !isUI) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
  
  // For UI components or graphical objects (including focus indicators in WCAG 2.2)
  if (isUI) {
    if (ratio >= 3) return 'AA'; // UI components need minimum 3:1 ratio
    return 'Fail';
  }
  
  return 'Fail';
}

function generateRandomColor(): string {
  // Generate more vibrant colors by using HSL
  const h = Math.random() * 360; // Any hue
  const s = 60 + Math.random() * 40; // 60-100% saturation
  const l = 30 + Math.random() * 40; // 30-70% lightness
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function generateAccessiblePalette(baseColor: string, harmonyType: ColorHarmony = 'all'): ColorCombination[] {
  const combinations: ColorCombination[] = [];
  const baseRgb = hexToRgb(baseColor);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  
  // More Coolors.co-style approach - create a cohesive palette first
  let colorPalette: string[] = [];
  
  // First, let's create a palette based on the harmony type
  switch (harmonyType) {
    case 'complementary':
      // Base color + variations + complementary + variations
      colorPalette = createComplementaryPalette(baseHsl);
      break;
    
    case 'analogous':
      // Base color + adjacent colors with variations
      colorPalette = createAnalogousPalette(baseHsl);
      break;
      
    case 'triadic':
      // Base color + two colors evenly spaced on the color wheel
      colorPalette = createTriadicPalette(baseHsl);
      break;
      
    case 'split-complementary':
      // Base color + colors adjacent to the complement
      colorPalette = createSplitComplementaryPalette(baseHsl);
      break;
      
    case 'monochromatic':
      // Base color with variations in lightness and saturation
      colorPalette = createMonochromaticPalette(baseHsl);
      break;
      
    case 'tetradic':
      // Four colors spaced evenly around the color wheel (also called rectangular)
      colorPalette = createTetradicPalette(baseHsl);
      break;
      
    case 'square':
      // Four colors spaced in a square around the color wheel
      colorPalette = createSquarePalette(baseHsl);
      break;
      
    case 'all':
    default:
      // Mix of techniques based on the base color
      colorPalette = createMixedPalette(baseHsl);
      break;
  }
  
  // Limit to either 6 or 9 colors for a tidy layout (3x2 or 3x3 grid)
  // If we have between 4 and 6 colors, keep them all
  // If we have more than 6, extend to 9 by adding variations
  // If we have less than 4, extend to 6 by adding more variations
  
  if (colorPalette.length > 6 && colorPalette.length < 9) {
    // Extend to 9 colors by adding variations (lighten/darken) of existing colors
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    while (colorPalette.length < 9) {
      // Add more variations based on the base color and existing palette colors
      if (colorPalette.length % 2 === 0) {
        // Add a lighter variation of the base
        colorPalette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 25, 90)));
      } else {
        // Add a darker variation of the base
        colorPalette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 25, 10)));
      }
    }
  } else if (colorPalette.length < 4) {
    // Extend to 6 colors
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const complementHue = (baseHsl.h + 180) % 360;
    
    // Add variations to reach 6 colors
    while (colorPalette.length < 6) {
      const index = colorPalette.length;
      if (index % 3 === 0) {
        // Add lighter variations
        colorPalette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 90)));
      } else if (index % 3 === 1) {
        // Add complementary variations
        colorPalette.push(hslToHexString(complementHue, baseHsl.s, baseHsl.l));
      } else {
        // Add darker variations
        colorPalette.push(hslToHexString(baseHsl.h, baseHsl.s - 10, Math.max(baseHsl.l - 20, 10)));
      }
    }
  } else if (colorPalette.length > 9) {
    // If more than 9, trim to exactly 9
    colorPalette = colorPalette.slice(0, 9);
  }
  
  // Make sure the base color is always first in the palette
  // First, check if the base color is already in the palette
  const baseColorHex = rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b);
  if (!colorPalette.includes(baseColorHex)) {
    // If not, add it to the beginning
    colorPalette.unshift(baseColorHex);
    
    // Now make sure we still have either 6 or 9 colors total
    if (colorPalette.length > 9) {
      colorPalette = colorPalette.slice(0, 9);
    } else if (colorPalette.length > 6 && colorPalette.length < 9) {
      colorPalette = colorPalette.slice(0, 6);
    }
  } else {
    // If it exists, move it to the front
    const index = colorPalette.indexOf(baseColorHex);
    if (index > 0) {
      colorPalette.splice(index, 1);
      colorPalette.unshift(baseColorHex);
    }
  }
  
  // Now generate accessible combinations using the palette
  for (let i = 0; i < colorPalette.length; i++) {
    const bgColor = colorPalette[i];
    const bgRgb = hexToRgb(bgColor);
    const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);
    const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    // Test with white text
    const whiteLuminance = 1; // White has luminance of 1
    const whiteContrast = getContrastRatio(whiteLuminance, bgLuminance);
    
    // Test with black text
    const blackLuminance = 0; // Black has luminance of 0
    const blackContrast = getContrastRatio(blackLuminance, bgLuminance);
    
    // Use the better contrast option
    const textColor = whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
    const ratio = Math.max(whiteContrast, blackContrast);
    
    // Determine WCAG level (using WCAG 2.2 standards)
    // Use regular text by default, but could be extended to detect UI elements
    const wcagLevel = getWCAGLevel(ratio, false, false);
    
    // If it's the first one (index 0), always mark it as "Base" regardless of other factors
    let name = i === 0 ? "Base" : determineColorName(baseHsl, bgHsl, harmonyType);
    
    // Add to combinations
    combinations.push({
      background: bgColor,
      text: textColor,
      name,
      ratio,
      wcagLevel,
      // Flag to indicate this is the base color (for highlighting in UI)
      isBaseColor: i === 0
    });
  }
  
  // First, make sure the base color is always at the front of the array, 
  // regardless of its WCAG level or contrast ratio
  const baseColorCombo = combinations.find(combo => combo.isBaseColor);
  const otherCombos = combinations.filter(combo => !combo.isBaseColor);
  
  // Sort other combinations by WCAG level (AAA first, then AA, then fails)
  const sortedOtherCombos = otherCombos.sort((a, b) => {
    if (a.wcagLevel !== b.wcagLevel) {
      if (a.wcagLevel === 'AAA') return -1;
      if (b.wcagLevel === 'AAA') return 1;
      if (a.wcagLevel === 'AA') return -1;
      if (b.wcagLevel === 'AA') return 1;
    }
    return b.ratio - a.ratio;
  });
  
  // Place the base color at the start of the array
  return baseColorCombo ? [baseColorCombo, ...sortedOtherCombos] : sortedOtherCombos;
}

// Helper functions to create color palettes similar to Coolors.co

function createComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  const complementaryHue = (baseHsl.h + 180) % 360;
  
  // Add base color variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base color
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter
  
  // Add complementary color variations
  palette.push(hslToHexString(complementaryHue, baseHsl.s, baseHsl.l)); // Complementary
  palette.push(hslToHexString(complementaryHue, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker complementary
  palette.push(hslToHexString(complementaryHue, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter complementary
  
  // Add more variations for 9-color layout
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 20, 0), baseHsl.l)); // Desaturated base
  palette.push(hslToHexString(complementaryHue, Math.max(baseHsl.s - 20, 0), baseHsl.l)); // Desaturated complementary
  palette.push(hslToHexString((baseHsl.h + 90) % 360, baseHsl.s, baseHsl.l)); // 90-degree offset color
  
  return palette;
}

function createAnalogousPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  
  // Base color
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base color
  
  // Create a smooth progression of analogous colors (adjacent on the color wheel)
  palette.push(hslToHexString((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l)); // 30 degrees left
  palette.push(hslToHexString((baseHsl.h - 15 + 360) % 360, baseHsl.s, baseHsl.l)); // 15 degrees left
  palette.push(hslToHexString((baseHsl.h + 15) % 360, baseHsl.s, baseHsl.l)); // 15 degrees right
  palette.push(hslToHexString((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l)); // 30 degrees right
  
  // Add variations of base color with different lightness
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 10))); // Darker base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 90))); // Lighter base
  
  // Add desaturated variants
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 30, 0), baseHsl.l)); // Less saturated
  palette.push(hslToHexString((baseHsl.h + 15) % 360, Math.max(baseHsl.s - 20, 0), baseHsl.l + 5)); // Muted variant
  
  return palette;
}

function createTriadicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  const triadicHue1 = (baseHsl.h + 120) % 360;
  const triadicHue2 = (baseHsl.h + 240) % 360;
  
  // Base color and variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base color
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 10))); // Darker base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 90))); // Lighter base
  
  // First triadic color and variations
  palette.push(hslToHexString(triadicHue1, baseHsl.s, baseHsl.l)); // First triadic
  palette.push(hslToHexString(triadicHue1, baseHsl.s, Math.min(baseHsl.l + 10, 90))); // Lighter first triadic
  palette.push(hslToHexString(triadicHue1, baseHsl.s - 10, baseHsl.l)); // Desaturated first triadic
  
  // Second triadic color and variations
  palette.push(hslToHexString(triadicHue2, baseHsl.s, baseHsl.l)); // Second triadic
  palette.push(hslToHexString(triadicHue2, baseHsl.s, Math.max(baseHsl.l - 10, 10))); // Darker second triadic  
  palette.push(hslToHexString(triadicHue2, baseHsl.s - 10, baseHsl.l)); // Desaturated second triadic
  
  return palette;
}

function createSplitComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  const complementaryHue = (baseHsl.h + 180) % 360;
  const splitComp1 = (complementaryHue - 30 + 360) % 360;
  const splitComp2 = (complementaryHue + 30) % 360;
  
  // Base color and variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter base
  
  // Split complementary colors with variations
  palette.push(hslToHexString(splitComp1, baseHsl.s, baseHsl.l)); // First split
  palette.push(hslToHexString(splitComp2, baseHsl.s, baseHsl.l)); // Second split
  palette.push(hslToHexString(complementaryHue, baseHsl.s, baseHsl.l)); // Complementary
  
  // Additional variations
  palette.push(hslToHexString(splitComp1, Math.max(baseHsl.s - 15, 0), baseHsl.l + 5)); // Desaturated first split
  palette.push(hslToHexString(splitComp2, Math.max(baseHsl.s - 15, 0), baseHsl.l - 5)); // Desaturated second split
  palette.push(hslToHexString(complementaryHue, Math.max(baseHsl.s - 10, 0), baseHsl.l)); // Desaturated complementary
  
  return palette;
}

function createMonochromaticPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  
  // Base color
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base color
  
  // Create variations with different saturations and lightness
  // Darker variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 30, 5))); // Much darker
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker
  
  // Lighter variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 15, 95))); // Lighter
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 30, 95))); // Much lighter
  
  // Saturation variations (using original lightness)
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 30, 0), baseHsl.l)); // Less saturated
  palette.push(hslToHexString(baseHsl.h, Math.min(baseHsl.s + 30, 100), baseHsl.l)); // More saturated
  
  // Combined lightness and saturation variations
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 20, 0), Math.max(baseHsl.l - 10, 10))); // Darker and less saturated
  palette.push(hslToHexString(baseHsl.h, Math.min(baseHsl.s + 20, 100), Math.min(baseHsl.l + 10, 90))); // Lighter and more saturated
  
  return palette;
}

function createTetradicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  // Tetradic uses 4 colors in a rectangle on the color wheel (2 complementary pairs)
  const tetradicHue1 = (baseHsl.h + 60) % 360;  // 60 degrees from base
  const tetradicHue2 = (baseHsl.h + 180) % 360; // 180 degrees from base (complementary)
  const tetradicHue3 = (baseHsl.h + 240) % 360; // 240 degrees from base (60 degrees from complementary)
  
  // Base color and variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker base
  
  // Second color (60 degrees)
  palette.push(hslToHexString(tetradicHue1, baseHsl.s, baseHsl.l)); // Second color
  
  // Third color (complementary to base)
  palette.push(hslToHexString(tetradicHue2, baseHsl.s, baseHsl.l)); // Third color
  
  // Fourth color (240 degrees)
  palette.push(hslToHexString(tetradicHue3, baseHsl.s, baseHsl.l)); // Fourth color
  
  // Variations
  palette.push(hslToHexString(tetradicHue1, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter second
  palette.push(hslToHexString(tetradicHue2, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter third
  palette.push(hslToHexString(tetradicHue3, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker fourth
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 20, 0), Math.min(baseHsl.l + 20, 90))); // Desaturated, lighter base
  
  return palette;
}

function createSquarePalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  // Square uses 4 colors evenly spaced around the color wheel (90 degrees apart)
  const squareHue1 = (baseHsl.h + 90) % 360;  // 90 degrees from base
  const squareHue2 = (baseHsl.h + 180) % 360; // 180 degrees from base (complementary)
  const squareHue3 = (baseHsl.h + 270) % 360; // 270 degrees from base
  
  // Base color and variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker base
  
  // Second color (90 degrees)
  palette.push(hslToHexString(squareHue1, baseHsl.s, baseHsl.l)); // Second color
  
  // Third color (complementary to base)
  palette.push(hslToHexString(squareHue2, baseHsl.s, baseHsl.l)); // Third color
  
  // Fourth color (270 degrees)
  palette.push(hslToHexString(squareHue3, baseHsl.s, baseHsl.l)); // Fourth color
  
  // Variations
  palette.push(hslToHexString(squareHue1, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter second
  palette.push(hslToHexString(squareHue2, baseHsl.s, Math.min(baseHsl.l + 15, 90))); // Lighter third
  palette.push(hslToHexString(squareHue3, baseHsl.s, Math.max(baseHsl.l - 15, 10))); // Darker fourth
  palette.push(hslToHexString(baseHsl.h, Math.max(baseHsl.s - 20, 0), Math.min(baseHsl.l + 20, 90))); // Desaturated, lighter base
  
  return palette;
}

function createMixedPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const palette: string[] = [];
  const complementaryHue = (baseHsl.h + 180) % 360;
  
  // Base color and variations
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, baseHsl.l)); // Base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 10))); // Darker base
  palette.push(hslToHexString(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 90))); // Lighter base
  
  // Complementary
  palette.push(hslToHexString(complementaryHue, baseHsl.s, baseHsl.l)); // Complementary
  
  // Triadic (120° apart)
  palette.push(hslToHexString((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l)); // First triadic
  palette.push(hslToHexString((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l)); // Second triadic
  
  // Analogous (30° apart)
  palette.push(hslToHexString((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l)); // Analogous right
  palette.push(hslToHexString((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l)); // Analogous left
  
  // Split complementary
  palette.push(hslToHexString((complementaryHue - 30 + 360) % 360, baseHsl.s, baseHsl.l)); // Split left
  
  return palette;
}

function hslToHexString(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function determineColorName(baseHsl: { h: number, s: number, l: number }, colorHsl: { h: number, s: number, l: number }, harmonyType: ColorHarmony): string {
  // Calculate hue difference
  const hueDiff = Math.abs(baseHsl.h - colorHsl.h);
  
  // Base color or variation
  if (hueDiff < 15) {
    // For monochromatic, check if it's saturation difference
    if (harmonyType === 'monochromatic') {
      const satDiff = Math.abs(baseHsl.s - colorHsl.s);
      if (satDiff > 15) {
        return colorHsl.s > baseHsl.s ? 'More Saturated' : 'Less Saturated';
      }
    }
    
    // Check lightness difference
    if (Math.abs(baseHsl.l - colorHsl.l) < 5) {
      return 'Base';
    } else {
      return colorHsl.l > baseHsl.l ? 'Lighter Base' : 'Darker Base';
    }
  }
  
  // Check for complementary (180° away)
  if (Math.abs(hueDiff - 180) < 15) {
    return 'Complementary';
  }
  
  // Check for analogous (30° away)
  if (hueDiff <= 40) {
    return 'Analogous';
  }
  
  // Check for triadic (120° away)
  if (Math.abs(hueDiff - 120) < 15 || Math.abs(hueDiff - 240) < 15) {
    return 'Triadic';
  }
  
  // Check for split complementary
  if (Math.abs(hueDiff - 150) < 15 || Math.abs(hueDiff - 210) < 15) {
    return 'Split Complementary';
  }
  
  // Check for tetradic (60° and 240° away)
  if (Math.abs(hueDiff - 60) < 15 || Math.abs(hueDiff - 240) < 15) {
    return 'Tetradic';
  }
  
  // Check for square (90°, 180°, 270° away)
  if (Math.abs(hueDiff - 90) < 15 || Math.abs(hueDiff - 270) < 15) {
    return 'Square';
  }
  
  // If it's monochromatic but not a base variation, it must be a saturation variation
  if (harmonyType === 'monochromatic') {
    return 'Monochromatic';
  }
  
  // If it doesn't match a specific relationship, use the harmony type
  return harmonyType.charAt(0).toUpperCase() + harmonyType.slice(1);
}

// Pro pill styling
const proPillStyle = "ml-1 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold inline-flex items-center scale-[0.85] origin-left";

export function WCAGColorPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState('#1a365d');
  const [generatedPalette, setGeneratedPalette] = useState<ColorCombination[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [colorHarmony, setColorHarmony] = useState<ColorHarmony>('all');
  const paletteRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const generateNewPalette = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newBaseColor = generateRandomColor();
      setBaseColor(newBaseColor);
      const newPalette = generateAccessiblePalette(newBaseColor, colorHarmony);
      setGeneratedPalette(newPalette);
      setIsGenerating(false);
    }, 500);
  };

  const handleBaseColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
    const newPalette = generateAccessiblePalette(newColor, colorHarmony);
    setGeneratedPalette(newPalette);
  };

  const getLevelBadgeColor = (level: 'AAA' | 'AA' | 'Fail') => {
    switch (level) {
      case 'AAA':
        return 'bg-green-100 text-green-800';
      case 'AA':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const exportToPDF = async () => {
    if (!paletteRef.current) return;
    
    const canvas = await html2canvas(paletteRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
    
    // Add color information
    let y = imgHeight * ratio + 10;
    generatedPalette.forEach(combo => {
      pdf.setFontSize(10);
      pdf.text(`${combo.name}:`, 10, y);
      pdf.text(`Background: ${combo.background}`, 20, y + 5);
      pdf.text(`Text: ${combo.text}`, 20, y + 10);
      pdf.text(`Contrast Ratio: ${combo.ratio.toFixed(2)}:1`, 20, y + 15);
      y += 20;
    });
    
    pdf.save('color-palette.pdf');
  };

  const exportToText = () => {
    const content = generatedPalette.map(combo => (
      `${combo.name}\n` +
      `Background: ${combo.background}\n` +
      `Text: ${combo.text}\n` +
      `Contrast Ratio: ${combo.ratio.toFixed(2)}:1\n` +
      `WCAG Level: ${combo.wcagLevel}\n\n`
    )).join('---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'color-palette.txt');
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            WCAG Color Palette Generator
          </h2>
          <p className="text-gray-600">
            Generate accessible color combinations that meet WCAG 2.1 and 2.2 contrast requirements.
            Our algorithm creates diverse palettes using multiple color harmonies including complementary, analogous, triadic, 
            monochromatic, tetradic, square, and split-complementary.
          </p>
        </div>

        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <LoadingSpinner size="large" className="mb-4" />
              <p className="text-gray-900 font-medium">Generating Color Palette...</p>
            </div>
          </div>
        )}

        {/* Generator Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-primary-100 relative">
          <div className="absolute -top-3 left-4 bg-white px-2">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">Palette Generator</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-2">
            <div className="flex items-center justify-between">
              <span>Generate Custom Palette</span>
            </div>
          </h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Color Harmony
              </label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <button
                onClick={() => {
                  setColorHarmony('all');
                  const newPalette = generateAccessiblePalette(baseColor, 'all');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                All Harmonies
              </button>
              <button
                onClick={() => {
                  setColorHarmony('complementary');
                  const newPalette = generateAccessiblePalette(baseColor, 'complementary');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'complementary' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Complementary
              </button>
              <button
                onClick={() => {
                  setColorHarmony('analogous');
                  const newPalette = generateAccessiblePalette(baseColor, 'analogous');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'analogous' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Analogous
              </button>
              <button
                onClick={() => {
                  setColorHarmony('triadic');
                  const newPalette = generateAccessiblePalette(baseColor, 'triadic');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'triadic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Triadic
              </button>
              <button
                onClick={() => {
                  setColorHarmony('split-complementary');
                  const newPalette = generateAccessiblePalette(baseColor, 'split-complementary');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'split-complementary' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Split Comp
              </button>
              <button
                onClick={() => {
                  setColorHarmony('monochromatic');
                  const newPalette = generateAccessiblePalette(baseColor, 'monochromatic');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'monochromatic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Monochromatic
              </button>
              <button
                onClick={() => {
                  setColorHarmony('tetradic');
                  const newPalette = generateAccessiblePalette(baseColor, 'tetradic');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'tetradic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Tetradic
              </button>
              <button
                onClick={() => {
                  setColorHarmony('square');
                  const newPalette = generateAccessiblePalette(baseColor, 'square');
                  setGeneratedPalette(newPalette);
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  colorHarmony === 'square' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                Square
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="baseColor" className="block text-sm font-medium text-gray-700 mb-2">
                Base Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="baseColor"
                  value={baseColor}
                  onChange={handleBaseColorChange}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    const newColor = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                      setBaseColor(newColor);
                      const newPalette = generateAccessiblePalette(newColor, colorHarmony);
                      setGeneratedPalette(newPalette);
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
            <button
              onClick={generateNewPalette}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border-none rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate Random
            </button>
          </div>
        </div>

        {/* Generated Palette */}
        {generatedPalette.length > 0 && (
          <div className="border-2 border-dashed border-secondary-100 rounded-lg p-6 mb-8 bg-white shadow-md relative">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <span className="text-xs font-medium text-secondary-600 uppercase tracking-wider">Generated Palette</span>
            </div>
            <div className="flex justify-end gap-4 mb-6">
              <button
                onClick={exportToText}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 mr-2" />
                Export as Text
                <span className={proPillStyle}>PRO</span>
              </button>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Export as PDF
                <span className={proPillStyle}>PRO</span>
              </button>
            </div>
            <div ref={paletteRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedPalette.map((combo, index) => (
                  <div
                    key={`${combo.background}-${combo.text}-${index}`}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                      combo.isBaseColor ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div
                      style={{ backgroundColor: combo.background }}
                      className="h-32 p-4 flex items-center justify-center"
                    >
                      <p style={{ color: combo.text }} className="text-lg font-medium">
                        Sample Text
                      </p>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${combo.isBaseColor ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                          {combo.isBaseColor ? (
                            <div className="flex items-center">
                              <span className="mr-1">🔍</span> {combo.name} Color
                            </div>
                          ) : (
                            combo.name
                          )}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(
                            combo.wcagLevel
                          )}`}
                        >
                          {combo.wcagLevel}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: combo.background }}
                            />
                            <span className="text-sm text-gray-600">Background</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(combo.background)}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          >
                            {copiedColor === combo.background ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {combo.background}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: combo.text }}
                            />
                            <span className="text-sm text-gray-600">Text</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(combo.text)}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          >
                            {copiedColor === combo.text ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {combo.text}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Info className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-600">Contrast</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            {combo.ratio.toFixed(2)}:1
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            WCAG Color Usage Guidelines
          </h3>
          
          <p className="text-gray-700 mb-6">
            Proper color usage is crucial for accessibility. About 1 in 12 men and 1 in 200 women have some form of color vision deficiency, 
            and many users have low vision or situational limitations like bright sunlight. Following WCAG guidelines ensures your content is 
            accessible to all users regardless of their visual capabilities.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contrast Requirements (WCAG 2.1 & 2.2)</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>AAA level (Enhanced): 7:1 contrast ratio for normal text</li>
                <li>AA level (Minimum): 4.5:1 contrast ratio for normal text</li>
                <li>Large text (18pt+ or 14pt+ bold): 3:1 for AA, 4.5:1 for AAA</li>
                <li>UI components and graphical objects: minimum 3:1 against adjacent colors</li>
                <li>Focus indicators: minimum 3:1 contrast (WCAG 2.2, SC 2.4.11)</li>
                <li>Target size: minimum 24x24 pixels (WCAG 2.2, SC 2.5.8)</li>
                <li>Dragging movement: alternatives required (WCAG 2.2, SC 2.5.7)</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mt-6 mb-3">Why Contrast Matters</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Improves readability for all users, especially in poor lighting</li>
                <li>Essential for people with low vision or color blindness</li>
                <li>Helps maintain usability when screens are viewed outdoors</li>
                <li>Can reduce eye strain during prolonged usage</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Beyond Contrast: Color Best Practices</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Never use color as the only means to convey information (WCAG 1.4.1)</li>
                <li>Provide additional indicators like icons, patterns, or text labels</li>
                <li>Test your palette with color blindness simulators</li>
                <li>Consider how your colors appear in high contrast modes</li>
                <li>Maintain consistent color meaning throughout your interface</li>
                <li>Limit your palette to 3-5 primary colors for better cohesion</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mt-6 mb-3">Implementation Tips</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use the generated palettes for complementary elements</li>
                <li>Text over colored backgrounds should meet minimum contrast</li>
                <li>Apply your base color to primary interactive elements</li>
                <li>Save AAA combinations for critical content and navigation</li>
                <li>Test your design in different lighting conditions</li>
                <li>Document your color system for consistent implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}