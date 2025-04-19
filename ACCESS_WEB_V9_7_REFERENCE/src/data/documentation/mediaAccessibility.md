# Media Accessibility Testing Guide

## Overview

Media Accessibility Testing is a feature that analyzes audio, video, and embedded media content on a webpage to ensure it meets WCAG 2.1 and 2.2 accessibility standards. This tool helps identify issues that may prevent users with disabilities from accessing media content effectively.

## Key Features

- **Automated Detection**: Automatically detects various media types (audio, video, embedded)
- **Comprehensive Analysis**: Checks for captions, transcripts, audio descriptions, and more
- **Issue Classification**: Groups issues by media type and prioritizes by severity
- **Status Indicators**: Clearly marks issues as "Critical", "Needs Attention", or "Review"
- **Detailed Recommendations**: Provides specific guidance on how to fix identified issues

## How to Use

1. Navigate to the WCAG Checker page
2. Enter the URL you want to analyze
3. Make sure the "Test Media" option is enabled (this is enabled by default)
4. Click "Analyze URL"
5. Navigate to the "Media" tab in the results section to view media accessibility issues

## Understanding the Results

### Media Tab

The Media tab in the results section displays issues organized by media type:

- **Video Issues**: Accessibility problems related to video content
- **Audio Issues**: Accessibility problems related to audio-only content
- **Embedded Media Issues**: Accessibility problems related to embedded media players

Each issue is marked with one of the following status indicators:

- **Critical** (Red): Must be fixed to meet basic accessibility requirements
- **Needs Attention** (Orange): Should be addressed for better accessibility
- **Review** (Blue): Should be manually reviewed to ensure compliance

### Common Issues Detected

1. **Missing Captions**
   - WCAG Reference: 1.2.2 (Level A)
   - Description: Videos without captions are inaccessible to deaf or hard of hearing users.
   - Solution: Add synchronized captions that include all dialogue and important sound effects.

2. **Missing Audio Descriptions**
   - WCAG Reference: 1.2.3 (Level A), 1.2.5 (Level AA)
   - Description: Videos without audio descriptions don't convey visual information to blind users.
   - Solution: Add audio descriptions that narrate important visual content not covered in the main audio track.

3. **Missing Transcript**
   - WCAG Reference: 1.2.1 (Level A)
   - Description: Audio content without transcripts is inaccessible to deaf or hard of hearing users.
   - Solution: Provide a text transcript that includes all spoken content and important sound effects.

4. **Autoplay Issues**
   - WCAG Reference: 2.2.2 (Level A)
   - Description: Media that plays automatically can be disruptive, especially for screen reader users.
   - Solution: Disable autoplay or provide a mechanism to pause or stop the media.

5. **Media Player Accessibility**
   - WCAG Reference: 2.1.1 (Level A), 2.1.2 (Level A)
   - Description: Media players must be keyboard accessible and properly labeled.
   - Solution: Ensure media controls can be operated with keyboard alone and have appropriate ARIA labels.

## Pro Tips

1. **Keyboard Testing**: Always verify that media controls can be accessed and operated using only a keyboard.

2. **Length Considerations**: For longer videos (over 2 minutes), consider providing both captions and a full transcript.

3. **Audio Description Options**: Consider providing a separate version of videos with extended audio descriptions for complex visual content.

4. **Quality Assurance**: Have people with disabilities test your media accessibility features before publishing.

5. **Embedding Best Practices**: When embedding third-party media, choose players that support accessibility features like captions and keyboard controls.

## Related Resources

- [WCAG 2.1 Time-based Media Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/time-based-media.html)
- [Creating Accessible Audio and Video](https://webaim.org/techniques/captions/)
- [Audio Description Best Practices](https://www.w3.org/WAI/media/av/description/)

For more detailed guidance on implementing accessible media, please contact our support team or consult the WCAG documentation.