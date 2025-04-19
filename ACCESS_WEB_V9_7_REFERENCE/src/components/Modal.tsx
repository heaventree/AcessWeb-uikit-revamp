import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  /**
   * Reference to the element that triggered the modal,
   * focus will return to this element when modal closes
   */
  triggerRef?: React.RefObject<HTMLElement>;
}

export function Modal({ isOpen, onClose, children, title, triggerRef }: ModalProps) {
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Ref to store all focusable elements
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  
  // Finds all focusable elements in the modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    return Array.from(
      modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
  }, []);
  
  // Handle ESC key press to close modal
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Tab') {
      // Update focusable elements on each tab press to account for dynamic content
      focusableElementsRef.current = getFocusableElements();
      
      if (!focusableElementsRef.current.length) return;
      
      const firstFocusableEl = focusableElementsRef.current[0];
      const lastFocusableEl = focusableElementsRef.current[focusableElementsRef.current.length - 1];
      
      // Trap focus in modal
      if (event.shiftKey && document.activeElement === firstFocusableEl) {
        event.preventDefault();
        lastFocusableEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableEl) {
        event.preventDefault();
        firstFocusableEl.focus();
      }
    }
  }, [onClose, getFocusableElements]);
  
  // Store the active element when modal opens to restore focus later
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element to return to later
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Set up keyboard event listener
      document.addEventListener('keydown', handleKeyDown);
      
      // Set focus to close button or first focusable element after modal opens
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        } else {
          focusableElementsRef.current = getFocusableElements();
          if (focusableElementsRef.current.length > 0) {
            focusableElementsRef.current[0].focus();
          }
        }
      }, 0);
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
      
      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to trigger element or previously focused element
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, getFocusableElements, triggerRef]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal Panel */}
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 
              id="modal-title" 
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {title}
            </h3>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}