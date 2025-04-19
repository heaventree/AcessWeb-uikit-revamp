import { type AccessibilityIssue } from '../types';

/**
 * Analyzes web page content for media accessibility issues
 * Checks audio and video elements for proper accessibility implementation
 */
export async function analyzeMediaAccessibility(html: string, url: string): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all video elements
  const videoElements = doc.querySelectorAll('video');
  analyzeVideoElements(videoElements, issues, url);
  
  // Find all audio elements
  const audioElements = doc.querySelectorAll('audio');
  analyzeAudioElements(audioElements, issues, url);
  
  // Find iframe elements that might contain media (YouTube, Vimeo, etc.)
  const iframeElements = doc.querySelectorAll('iframe');
  analyzeIframeMediaElements(iframeElements, issues, url);
  
  return issues;
}

/**
 * Analyzes video elements for accessibility issues
 */
function analyzeVideoElements(
  videoElements: NodeListOf<HTMLVideoElement>, 
  issues: AccessibilityIssue[], 
  url: string
): void {
  videoElements.forEach((video, index) => {
    // Check for captions
    const hasCaptions = video.querySelector('track[kind="captions"]') !== null;
    if (!hasCaptions) {
      issues.push({
        id: `video-missing-captions-${index}`,
        description: 'Video element is missing closed captions',
        impact: 'serious',
        mediaType: 'video',
        nodes: [video.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
        wcagCriteria: ['1.2.2'],
        url,
      });
    }
    
    // Check for audio descriptions
    const hasAudioDescription = video.querySelector('track[kind="descriptions"]') !== null;
    if (!hasAudioDescription) {
      issues.push({
        id: `video-missing-audio-description-${index}`,
        description: 'Video may require audio descriptions for visual content',
        impact: 'moderate',
        mediaType: 'video',
        nodes: [video.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded.html',
        wcagCriteria: ['1.2.3', '1.2.5'],
        url,
      });
    }
    
    // Check for keyboard accessibility
    const hasControls = video.hasAttribute('controls');
    if (!hasControls) {
      issues.push({
        id: `video-missing-controls-${index}`,
        description: 'Video element does not have built-in controls for keyboard users',
        impact: 'serious',
        mediaType: 'video',
        nodes: [video.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        wcagCriteria: ['2.1.1'],
        url,
      });
    }
    
    // Check for autoplay with sound
    const hasAutoplay = video.hasAttribute('autoplay');
    const hasMuted = video.hasAttribute('muted');
    if (hasAutoplay && !hasMuted) {
      issues.push({
        id: `video-autoplay-with-sound-${index}`,
        description: 'Video autoplays with sound, which may be disruptive',
        impact: 'moderate',
        mediaType: 'video',
        nodes: [video.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html',
        wcagCriteria: ['1.4.2'],
        url,
      });
    }
  });
}

/**
 * Analyzes audio elements for accessibility issues
 */
function analyzeAudioElements(
  audioElements: NodeListOf<HTMLAudioElement>, 
  issues: AccessibilityIssue[], 
  url: string
): void {
  audioElements.forEach((audio, index) => {
    // Check for transcript link nearby
    const parentElement = audio.parentElement;
    let hasTranscriptLink = false;
    
    if (parentElement) {
      const links = parentElement.querySelectorAll('a');
      for (const link of links) {
        const linkText = link.textContent?.toLowerCase() || '';
        if (linkText.includes('transcript') || linkText.includes('text version')) {
          hasTranscriptLink = true;
          break;
        }
      }
    }
    
    if (!hasTranscriptLink) {
      issues.push({
        id: `audio-missing-transcript-${index}`,
        description: 'Audio element does not appear to have an associated transcript',
        impact: 'serious',
        mediaType: 'audio',
        nodes: [audio.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html',
        wcagCriteria: ['1.2.1'],
        url,
      });
    }
    
    // Check for keyboard accessibility
    const hasControls = audio.hasAttribute('controls');
    if (!hasControls) {
      issues.push({
        id: `audio-missing-controls-${index}`,
        description: 'Audio element does not have built-in controls for keyboard users',
        impact: 'serious',
        mediaType: 'audio',
        nodes: [audio.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        wcagCriteria: ['2.1.1'],
        url,
      });
    }
    
    // Check for autoplay
    const hasAutoplay = audio.hasAttribute('autoplay');
    if (hasAutoplay) {
      issues.push({
        id: `audio-autoplay-${index}`,
        description: 'Audio autoplays, which may be disruptive',
        impact: 'moderate',
        mediaType: 'audio',
        nodes: [audio.outerHTML],
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html',
        wcagCriteria: ['1.4.2'],
        url,
      });
    }
  });
}

/**
 * Analyzes iframe elements that might contain media
 */
function analyzeIframeMediaElements(
  iframeElements: NodeListOf<HTMLIFrameElement>, 
  issues: AccessibilityIssue[], 
  url: string
): void {
  iframeElements.forEach((iframe, index) => {
    const src = iframe.src.toLowerCase();
    
    // Check for common video embedding platforms
    const isVideoEmbed = 
      src.includes('youtube.com') ||
      src.includes('vimeo.com') ||
      src.includes('dailymotion.com') ||
      src.includes('twitch.tv') ||
      src.includes('facebook.com/plugins/video') ||
      src.includes('player.theplatform.com');
      
    if (isVideoEmbed) {
      // Check if iframe has a title
      const hasTitle = iframe.hasAttribute('title') && iframe.getAttribute('title')?.trim() !== '';
      if (!hasTitle) {
        issues.push({
          id: `embedded-video-missing-title-${index}`,
          description: 'Embedded video iframe is missing a descriptive title attribute',
          impact: 'moderate',
          mediaType: 'embedded',
          nodes: [iframe.outerHTML],
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
          wcagCriteria: ['4.1.2'],
          url,
        });
      }
      
      // Check for YouTube/Vimeo caption parameters
      if (src.includes('youtube.com')) {
        if (!src.includes('cc_load_policy=1')) {
          issues.push({
            id: `youtube-missing-caption-param-${index}`,
            description: 'YouTube embed does not have captions enabled by default (cc_load_policy=1)',
            impact: 'moderate',
            mediaType: 'embedded',
            nodes: [iframe.outerHTML],
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
            wcagCriteria: ['1.2.2'],
            url,
          });
        }
      }
      
      // Check for adequate size for controls (touch target size)
      const width = iframe.width ? parseInt(iframe.width, 10) : iframe.clientWidth;
      const height = iframe.height ? parseInt(iframe.height, 10) : iframe.clientHeight;
      
      if (width < 320 || height < 180) {
        issues.push({
          id: `embedded-video-small-size-${index}`,
          description: 'Embedded media player is too small for comfortable interaction with controls',
          impact: 'moderate',
          mediaType: 'embedded',
          nodes: [iframe.outerHTML],
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html',
          wcagCriteria: ['2.5.5'],
          url,
        });
      }
    }
  });
}