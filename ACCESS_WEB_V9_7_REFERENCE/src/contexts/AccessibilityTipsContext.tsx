import React, { createContext, useState, useEffect, useContext } from 'react';

interface AccessibilityTip {
  id: string;
  title: string;
  description: string;
  wcagReference: string;
  element?: Element | null;
  elementSelector?: string;
}

interface AccessibilityTipsContextType {
  tips: AccessibilityTip[];
  activeTip: AccessibilityTip | null;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  addTip: (tip: AccessibilityTip) => void;
  removeTip: (id: string) => void;
  setActiveTip: (id: string | null) => void;
  clearTips: () => void;
}

const defaultContext: AccessibilityTipsContextType = {
  tips: [],
  activeTip: null,
  isEnabled: false,
  setIsEnabled: () => {},
  addTip: () => {},
  removeTip: () => {},
  setActiveTip: () => {},
  clearTips: () => {},
};

export const AccessibilityTipsContext = createContext<AccessibilityTipsContextType>(defaultContext);

export const useAccessibilityTips = () => useContext(AccessibilityTipsContext);

export const AccessibilityTipsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tips, setTips] = useState<AccessibilityTip[]>([]);
  const [activeTip, setActiveTipState] = useState<AccessibilityTip | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('accessibility-tips-state');
    if (savedState) {
      try {
        const { isEnabled: savedIsEnabled } = JSON.parse(savedState);
        setIsEnabled(savedIsEnabled);
      } catch (error) {
        console.error('Error loading accessibility tips state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('accessibility-tips-state', JSON.stringify({ isEnabled }));
  }, [isEnabled]);

  const addTip = (tip: AccessibilityTip) => {
    setTips(prevTips => {
      // Check if a tip with this ID already exists
      const existingTipIndex = prevTips.findIndex(t => t.id === tip.id);
      if (existingTipIndex !== -1) {
        // Replace the existing tip
        const newTips = [...prevTips];
        newTips[existingTipIndex] = tip;
        return newTips;
      }
      // Add new tip
      return [...prevTips, tip];
    });
  };

  const removeTip = (id: string) => {
    setTips(prevTips => prevTips.filter(tip => tip.id !== id));
    if (activeTip?.id === id) {
      setActiveTipState(null);
    }
  };

  const setActiveTip = (id: string | null) => {
    if (id === null) {
      setActiveTipState(null);
      return;
    }
    
    const tip = tips.find(t => t.id === id);
    if (tip) {
      setActiveTipState(tip);
    }
  };

  const clearTips = () => {
    setTips([]);
    setActiveTipState(null);
  };

  return (
    <AccessibilityTipsContext.Provider
      value={{
        tips,
        activeTip,
        isEnabled,
        setIsEnabled,
        addTip,
        removeTip,
        setActiveTip,
        clearTips,
      }}
    >
      {children}
    </AccessibilityTipsContext.Provider>
  );
};