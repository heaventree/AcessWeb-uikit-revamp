import React, { useEffect, useRef } from 'react';
import { useAccessibilityTips } from '../../contexts/AccessibilityTipsContext';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

export function AccessibilityTipsDemo() {
  const { addTip, isEnabled, setIsEnabled } = useAccessibilityTips();
  const demoRefs = {
    heading: useRef<HTMLHeadingElement>(null),
    image: useRef<HTMLImageElement>(null),
    button: useRef<HTMLButtonElement>(null),
    link: useRef<HTMLAnchorElement>(null),
    form: useRef<HTMLFormElement>(null),
    input: useRef<HTMLInputElement>(null),
  };

  // Initialize tips when the component mounts or when isEnabled changes
  useEffect(() => {
    if (!isEnabled) return;

    // Add tips for demo elements
    if (demoRefs.heading.current) {
      addTip({
        id: 'heading-structure-tip',
        title: 'Heading Structure',
        description: 'Headings should follow a hierarchical structure. Avoid skipping heading levels as it confuses screen reader users.',
        wcagReference: 'WCAG 2.4.6',
        element: demoRefs.heading.current,
      });
    }

    if (demoRefs.image.current) {
      addTip({
        id: 'alt-text-tip',
        title: 'Image Alt Text',
        description: 'All images must have alt text that describes the content and function of the image for screen reader users.',
        wcagReference: 'WCAG 1.1.1',
        element: demoRefs.image.current,
      });
    }

    if (demoRefs.button.current) {
      addTip({
        id: 'button-text-tip',
        title: 'Button Text',
        description: 'Button text should clearly indicate the action that will occur when activated. Avoid generic labels like "Click Here".',
        wcagReference: 'WCAG 2.4.9',
        element: demoRefs.button.current,
      });
    }

    if (demoRefs.link.current) {
      addTip({
        id: 'link-purpose-tip',
        title: 'Link Purpose',
        description: 'Links should have clear text that describes where the link will take the user, without relying on context.',
        wcagReference: 'WCAG 2.4.4',
        element: demoRefs.link.current,
      });
    }

    if (demoRefs.form.current) {
      addTip({
        id: 'form-structure-tip',
        title: 'Form Structure',
        description: 'Forms should be well-structured with clear labels, error handling, and logical tab order.',
        wcagReference: 'WCAG 3.3.2',
        element: demoRefs.form.current,
      });
    }

    if (demoRefs.input.current) {
      addTip({
        id: 'input-label-tip',
        title: 'Input Labels',
        description: 'All form inputs should have associated labels that clearly describe what information is expected.',
        wcagReference: 'WCAG 1.3.1',
        element: demoRefs.input.current,
      });
    }
  }, [addTip, isEnabled]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Accessibility Tips Demo</h1>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            This demo page illustrates the Accessibility Tips feature. Toggle the feature in the toolbar to see live contextual 
            tips for various elements on this page. Hover over an element to see its accessibility requirements.
          </p>
          {!isEnabled && (
            <button
              onClick={() => setIsEnabled(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Enable Accessibility Tips
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 ref={demoRefs.heading} className="text-2xl font-semibold mb-4 text-gray-800">
                Heading Structure Example
              </h2>
              <p className="text-gray-600 mb-4">
                Properly structured headings help users navigate content and understand the page hierarchy. This is especially important for screen reader users.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Image Alt Text Example</h2>
              <div className="flex justify-center mb-4">
                <img
                  ref={demoRefs.image}
                  src="https://placekitten.com/300/200"
                  alt="A cute kitten playing with a ball of yarn"
                  className="rounded-md"
                />
              </div>
              <p className="text-gray-600">
                This image has descriptive alt text: "A cute kitten playing with a ball of yarn"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Button Text Example</h2>
              <button
                ref={demoRefs.button}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Save Document
              </button>
              <p className="text-gray-600 mt-3">
                This button clearly states its purpose: "Save Document" instead of "Click Here"
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Link Purpose Example</h2>
              <a
                ref={demoRefs.link}
                href="#"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Download our accessibility guide (PDF, 2.4MB)
              </a>
              <p className="text-gray-600 mt-3">
                This link clearly describes its purpose and destination, as well as the file format and size.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Form Controls Example</h2>
              <form ref={demoRefs.form} className="space-y-4">
                <div>
                  <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    ref={demoRefs.input}
                    type="text"
                    id="demo-name"
                    name="demo-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="demo-email"
                    name="demo-email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Submit Form
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}