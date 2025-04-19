import type { Article } from '../../../types/blog';

export const wcagResource48: Article = {
  "id": "wcag-resource-48",
  "slug": "wcag-resource-user-controlled-animations-and-motion",
  "title": "User-Controlled Animations and Motion",
  "description": "Learn how to make animations and motion effects accessible for all users, especially those with motion sensitivity or vestibular disorders. Implement the prefers-reduced-motion media query, add manual controls, and create animations that don't cause discomfort.",
  "content": "# User-Controlled Animations and Motion\n\n## Introduction\n\nAnimations and motion effects can enhance user experience and provide visual interest on websites and applications. However, for some users—particularly those with vestibular disorders, motion sensitivity, epilepsy, or certain cognitive disabilities—these effects can cause physical discomfort, nausea, dizziness, migraines, or even seizures.\n\nThis article covers how to implement animations, transitions, and motion effects in an accessible way by giving users control over their experience.\n\n## WCAG Requirements\n\nThe Web Content Accessibility Guidelines (WCAG) include several specific requirements related to animations and motion:\n\n### 2.2.2 Pause, Stop, Hide (Level A (minimum accessibility requirements))\n\nFor any moving, blinking, or scrolling information that:\n1. Starts automatically\n2. Lasts more than five seconds\n3. Is presented in parallel with other content\n\nThere must be a mechanism for the user to pause, stop, or hide it, unless the movement is part of an essential activity.\n\n### 2.3.1 Three Flashes or Below Threshold (Level A (minimum accessibility requirements))\n\nWeb pages must not contain anything that flashes more than three times in any one-second period, or the flash must be below the general flash and red flash thresholds. This requirement helps prevent triggering seizures in people with photosensitive epilepsy.\n\n### 2.3.3 Animation from Interactions (Level A (minimum accessibility requirements)AA)\n\nMotion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.\n\n## Understanding Motion Sensitivity\n\nVarious conditions can make people sensitive to motion, including:\n\n* **Vestibular disorders**: Issues with the inner ear that can cause balance problems and make movement sensitivity worse\n* **Migraine disorders**: Certain movements can trigger or intensify migraines\n* **Motion sickness**: A common condition affecting many people to varying degrees\n* **Attention-related disabilities**: Motion can be especially distracting for people with ADHD or other attention-related disabilities\n* **Epilepsy and photosensitivity**: Flashing effects can trigger seizures in people with photosensitive epilepsy\n\nEven users without these conditions may prefer reduced motion in certain contexts, such as when using mobile devices on public transport or when experiencing fatigue.\n\n## Implementation Strategies\n\n### Respect Operating System Preferences with CSS\n\nModern operating systems allow users to indicate a preference for reduced motion. Websites can detect and respect this preference using the `prefers-reduced-motion` CSS media query.\n\n```css\n/* Standard animations when no preference is set */\n.card {\n  transition: transform 0.3s ease-in-out;\n}\n\n.card:hover {\n  transform: scale(1.05);\n}\n\n/* Reduced or removed animations when preference is indicated */\n@media (prefers-reduced-motion: reduce) {\n  .card {\n    transition: none;\n  }\n  \n  .card:hover {\n    transform: none;\n  }\n}\n```\n\nWith this approach, users who have indicated a preference for reduced motion in their operating system settings will automatically experience your site with minimal or no animations.\n\n### JavaScript Detection of Motion Preferences\n\nYou can also detect motion preferences using JavaScript:\n\n```javascript\n// Check if the user prefers reduced motion\nconst prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n\n// Apply different animation strategies based on preference\nif (prefersReducedMotion) {\n  // Use simplified or no animations\n  document.body.classList.add('reduced-motion');\n} else {\n  // Use standard animations\n  initializeAnimations();\n}\n\n// Listen for changes to the preference\nwindow.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {\n  if (event.matches) {\n    document.body.classList.add('reduced-motion');\n    pauseAllAnimations();\n  } else {\n    document.body.classList.remove('reduced-motion');\n    resumeAnimationsIfUserAllowed();\n  }\n});\n```\n\n### Providing Explicit Controls\n\nIn addition to respecting system preferences, it's good practice to provide explicit controls that allow users to toggle animations on your site.\n\n```html\n<div class=\"animation-controls\">\n  <button id=\"toggle-animation\" aria-pressed=\"true\">\n    Animations: On\n  </button>\n</div>\n```\n\n```javascript\nconst toggleButton = document.getElementById('toggle-animation');\nlet animationsEnabled = true;\n\ntoggleButton.addEventListener('click', () => {\n  animationsEnabled = !animationsEnabled;\n  document.body.classList.toggle('animations-disabled', !animationsEnabled);\n  \n  // Update button state and text\n  toggleButton.setAttribute('aria-pressed', animationsEnabled);\n  toggleButton.textContent = `Animations: ${animationsEnabled ? 'On' : 'Off'}`;\n  \n  // Stop or start animations based on new state\n  if (animationsEnabled) {\n    resumeAnimations();\n  } else {\n    pauseAnimations();\n  }\n});\n```\n\n### Controls for Carousels and Auto-playing Content\n\nContent that moves automatically (like carousels, slideshows, or auto-updating feeds) should always include pause/play controls:\n\n```html\n<div class=\"carousel\" aria-label=\"Product highlights carousel\">\n  <div class=\"carousel-items\"><!-- Slides here --></div>\n  \n  <div class=\"carousel-controls\">\n    <button class=\"carousel-prev\" aria-label=\"Previous slide\">←</button>\n    <button class=\"carousel-pause\" aria-pressed=\"false\" aria-label=\"Pause automatic slide rotation\">⏸</button>\n    <button class=\"carousel-next\" aria-label=\"Next slide\">→</button>\n  </div>\n</div>\n```\n\n```javascript\nconst carousel = document.querySelector('.carousel');\nconst pauseButton = carousel.querySelector('.carousel-pause');\nlet isPlaying = true;\nlet intervalId;\n\n// Start auto-rotation\nfunction startRotation() {\n  intervalId = setInterval(showNextSlide, 5000);\n  isPlaying = true;\n  pauseButton.setAttribute('aria-pressed', 'false');\n  pauseButton.innerHTML = '⏸';\n  pauseButton.setAttribute('aria-label', 'Pause automatic slide rotation');\n}\n\n// Stop auto-rotation\nfunction stopRotation() {\n  clearInterval(intervalId);\n  isPlaying = false;\n  pauseButton.setAttribute('aria-pressed', 'true');\n  pauseButton.innerHTML = '▶';\n  pauseButton.setAttribute('aria-label', 'Resume automatic slide rotation');\n}\n\n// Toggle play/pause\npauseButton.addEventListener('click', () => {\n  if (isPlaying) {\n    stopRotation();\n  } else {\n    startRotation();\n  }\n});\n\n// Initial setup\nstartRotation();\n\n// Stop rotation when user interacts with carousel navigation\ncarousel.querySelector('.carousel-prev').addEventListener('click', () => {\n  stopRotation();\n  showPreviousSlide();\n});\n\ncarousel.querySelector('.carousel-next').addEventListener('click', () => {\n  stopRotation();\n  showNextSlide();\n});\n```\n\n### Safe Animation Techniques\n\nWhen designing animations, consider these guidelines for more accessible motion:\n1. **Limit the area of motion**: Smaller animations are less likely to trigger symptoms\n2. **Reduce the distance elements move**: Subtle movements are generally safer\n3. **Avoid rapid direction changes**: Smooth, predictable motion is less problematic\n4. **Use transitions instead of abrupt changes**: Gentle fades are preferable to sudden appearance/disappearance\n5. **Limit the duration**: Keep animations brief when possible\n\n```css\n/* Better: Small, contained animation */\n.notification-dot {\n  animation: pulse 2s infinite;\n  animation-timing-function: ease-in-out;\n}\n\n@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.2); }\n  100% { transform: scale(1); }\n}\n\n/* Problematic: Full-screen, complex animation */\n.page-transition {\n  animation: spin-and-zoom 0.5s;\n}\n\n@keyframes spin-and-zoom {\n  0% { transform: rotate(0deg) scale(1); }\n  100% { transform: rotate(360deg) scale(2); }\n}\n```\n\n### Avoiding Problematic Animation Patterns\n\nSome animation patterns are particularly problematic and should be avoided or used with extreme caution:\n1. **Parallax scrolling**: This effect, where background elements move at different speeds, can be particularly disorienting\n2. **Background video that can't be paused**: Autoplaying videos should always have pause controls\n3. **Scroll hijacking**: Taking control of the user's scrolling can cause disorientation\n4. **Rapid flashing**: Content that flashes more than three times per second can trigger seizures\n5. **Large zooming animations**: Especially those that involve the entire viewport\n\nIf you must use any of these effects, always provide an easy way to disable them and default to no animation for users who have indicated a preference for reduced motion.\n\n## Testing Animation Accessibility\n\nTo ensure your animations are accessible:\n1. **OS-level testing**: Test your site with the reduced motion setting enabled in your operating system\n2. **Manual controls testing**: Verify that any pause, play, or animation toggle controls work correctly\n3. **Flash testing tools**: Use tools that can detect potentially dangerous flash rates\n4. **Screen reader testing**: Confirm that animation controls and statuses are properly announced\n5. **User testing**: If possible, include people with motion sensitivity in your testing process\n\n### Tools for Testing\n\n- The **WCAG 2.0 Flashing Content Test** can help identify potentially harmful flashing content\n- **Photosensitive Epilepsy Analysis Tool (PEAT)** from the Trace Center can analyze videos for seizure risks\n- **Browser developer tools** often include options to simulate the `prefers-reduced-motion` setting\n\n## Case Study: Improving Animation Accessibility\n\nConsider an e-commerce site that initially implemented these problematic animations:\n1. A full-page parallax effect\n2. Product cards that zoomed and flipped on hover\n3. Autoplaying carousel with no controls\n\nAfter accessibility improvements:\n1. Parallax effect was made subtle and disabled for users with reduced motion preference\n2. Product card animations were simplified to gentle transitions that respect reduced motion settings\n3. Carousel received play/pause controls and automatically respected the user's motion preferences\n\nThese changes reduced user complaints about motion sickness while preserving visual interest for users who enjoy animations.\n\n## Conclusion\n\nCreating accessible animations means finding the right balance between engaging visual design and respecting user needs and preferences. By following WCAG guidelines, respecting system preferences, and providing explicit controls, you can create sites that are both visually dynamic and accessible to everyone.\n\nRemember that good animation accessibility doesn't just help users with specific disabilities—it creates a better experience for everyone across different contexts and situations. The key is to provide choice and control, allowing each user to experience your content in the way that works best for them.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Animation",
    "CSS",
    "Form Controls",
    "JavaScript",
    "Media Queries",
    "Mobile Accessibility",
    "Motion",
    "Seizure Prevention"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-03-31T03:25:02.965Z",
  "updatedAt": "2025-01-10T18:03:26.169Z",
  "readingTime": "15 min read",
  "vectorImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html",
  "relatedArticles": [
    "wcag-resource-1",   // Introduction to Web Accessibility
    "wcag-resource-13",  // Designing for Cognitive Disabilities
    "wcag-resource-29",  // Accessible Navigation Patterns
    "wcag-resource-34"   // Web Accessibility Testing Tools
  ],
  "tableOfContents": [
    {
      "id": "introduction",
      "title": "Introduction",
      "level": 2
    },
    {
      "id": "wcag-requirements",
      "title": "WCAG Requirements",
      "level": 2
    },
    {
      "id": "222-pause-stop-hide-level-a",
      "title": "2.2.2 Pause, Stop, Hide (Level A)",
      "level": 3
    },
    {
      "id": "231-three-flashes-or-below-threshold-level-a",
      "title": "2.3.1 Three Flashes or Below Threshold (Level A)",
      "level": 3
    },
    {
      "id": "233-animation-from-interactions-level-aaa",
      "title": "2.3.3 Animation from Interactions (Level AAA)",
      "level": 3
    },
    {
      "id": "understanding-motion-sensitivity",
      "title": "Understanding Motion Sensitivity",
      "level": 2
    },
    {
      "id": "implementation-strategies",
      "title": "Implementation Strategies",
      "level": 2
    },
    {
      "id": "respect-operating-system-preferences-with-css",
      "title": "Respect Operating System Preferences with CSS",
      "level": 3
    },
    {
      "id": "javascript-detection-of-motion-preferences",
      "title": "JavaScript Detection of Motion Preferences",
      "level": 3
    },
    {
      "id": "providing-explicit-controls",
      "title": "Providing Explicit Controls",
      "level": 3
    },
    {
      "id": "controls-for-carousels-and-auto-playing-content",
      "title": "Controls for Carousels and Auto-playing Content",
      "level": 3
    },
    {
      "id": "safe-animation-techniques",
      "title": "Safe Animation Techniques",
      "level": 3
    },
    {
      "id": "avoiding-problematic-animation-patterns",
      "title": "Avoiding Problematic Animation Patterns",
      "level": 3
    },
    {
      "id": "testing-animation-accessibility",
      "title": "Testing Animation Accessibility",
      "level": 2
    },
    {
      "id": "tools-for-testing",
      "title": "Tools for Testing",
      "level": 3
    },
    {
      "id": "case-study-improving-animation-accessibility",
      "title": "Case Study: Improving Animation Accessibility",
      "level": 2
    },
    {
      "id": "conclusion",
      "title": "Conclusion",
      "level": 2
    }
  ]

};
