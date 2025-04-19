import { useState, useEffect } from 'react';
import { qaSystem } from '../utils/qaSystem';

export function useQASystem() {
  const [restorePoints, setRestorePoints] = useState(qaSystem.getRestorePoints());
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<Array<{ id: string; passed: boolean }>>([]);

  useEffect(() => {
    // Run initial checks
    runChecks();

    // Create auto restore point every hour
    const interval = setInterval(async () => {
      await qaSystem.createRestorePoint('auto');
      setRestorePoints(qaSystem.getRestorePoints());
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  const runChecks = async () => {
    setIsChecking(true);
    try {
      const results = await qaSystem.runChecks();
      setCheckResults(results);
    } catch (error) {
      console.error('QA checks failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const createRestorePoint = async () => {
    const id = await qaSystem.createRestorePoint('manual');
    setRestorePoints(qaSystem.getRestorePoints());
    return id;
  };

  const restoreToPoint = async (id: string) => {
    const success = await qaSystem.restoreToPoint(id);
    if (success) {
      await runChecks();
    }
    return success;
  };

  return {
    restorePoints,
    isChecking,
    checkResults,
    runChecks,
    createRestorePoint,
    restoreToPoint,
    stablePoints: qaSystem.getStablePoints()
  };
}