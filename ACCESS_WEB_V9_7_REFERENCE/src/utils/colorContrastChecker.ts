import Color from 'color';

interface ColorContrast {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  isLargeText: boolean;
  passesAA: boolean;
  passesAAA: boolean;
  position: { x: number; y: number };
}

function getEffectiveBackground(element: HTMLElement): string {
  let background = getComputedStyle(element).backgroundColor;
  let currentElement: HTMLElement | null = element;
  let opacity = 1;

  while ((background === 'transparent' || background === 'rgba(0, 0, 0, 0)') && currentElement.parentElement) {
    currentElement = currentElement.parentElement;
    const style = getComputedStyle(currentElement);
    background = style.backgroundColor;
    opacity *= parseFloat(style.opacity) || 1;
  }

  // If no background color is found, default to white
  if (background === 'transparent' || background === 'rgba(0, 0, 0, 0)') {
    return '#FFFFFF';
  }

  // Apply opacity to background color
  if (opacity < 1) {
    const color = Color(background);
    return color.alpha(opacity).toString();
  }

  return background;
}

function getContrastRatio(color1: string, color2: string): number {
  try {
    const c1 = Color(color1);
    const c2 = Color(color2);
    
    const l1 = c1.luminosity();
    const l2 = c2.luminosity();
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1; // Return minimum ratio to flag as an issue
  }
}

export async function checkColorContrast(url: string): Promise<ColorContrast[]> {
  const results: ColorContrast[] = [];
  const iframe = document.createElement('iframe');

  try {
    // Set up iframe
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '1024px';
    iframe.style.height = '768px';
    document.body.appendChild(iframe);

    // Load URL in iframe
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = reject;
      iframe.src = url;
    });

    // Wait for styles to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access page content');
    }

    // Get all text elements
    const textElements = iframeDoc.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, a, span, li, td, th, label, input[type="text"], button'
    );

    textElements.forEach((element: HTMLElement) => {
      try {
        // Skip elements with no content
        if (!element.textContent?.trim()) return;

        const style = getComputedStyle(element);
        
        // Skip invisible elements
        if (style.display === 'none' || style.visibility === 'hidden' || 
            parseFloat(style.opacity) === 0) return;

        const color = style.color;
        const backgroundColor = getEffectiveBackground(element);
        const ratio = getContrastRatio(color, backgroundColor);

        // Check if text is "large" according to WCAG
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight) || 400;
        const isLargeText = fontSize >= 18.66 || (fontSize >= 14 && fontWeight >= 700);

        // Check compliance levels
        const passesAA = isLargeText ? ratio >= 3 : ratio >= 4.5;
        const passesAAA = isLargeText ? ratio >= 4.5 : ratio >= 7;

        // Only add to results if there's a potential issue
        if (!passesAAA) {
          const rect = element.getBoundingClientRect();
          results.push({
            element: element.outerHTML,
            foreground: color,
            background: backgroundColor,
            ratio,
            isLargeText,
            passesAA,
            passesAAA,
            position: {
              x: rect.left,
              y: rect.top
            }
          });
        }
      } catch (error) {
        console.warn('Error checking element contrast:', error);
      }
    });

  } catch (error) {
    console.error('Error checking color contrast:', error);
    throw new Error('Failed to analyze color contrast. Please check the URL and try again.');
  } finally {
    // Clean up
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }

  return results;
}