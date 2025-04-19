import { restoreFromTimestamp } from './restoreManager';
import { toast } from 'react-hot-toast';
import { commandHandler } from './commandHandler';
import { phaseManager } from './phaseManager';
import { qaSystem } from './qaSystem';

interface RestoreResult {
  success: boolean;
  timestamp: string | null;
  error?: string;
  version?: string;
}

export async function executeRestore(): Promise<RestoreResult> {
  // Set target date to March 19th, 2024 at 2am
  const targetDate = new Date('2024-03-19T02:00:00Z');
  
  try {
    // Run QA checks before restore
    const preRestoreChecks = await qaSystem.runChecks();
    console.log('Pre-restore checks:', preRestoreChecks);

    // First check if we have a phase from that time
    const phases = phaseManager.listPhases();
    const targetPhase = phases.find(phase => {
      const phaseInfo = phaseManager.getPhaseInfo(phase);
      return phaseInfo && 
        new Date(phaseInfo.timestamp) <= targetDate &&
        phaseInfo.metadata?.version === '2.4';
    });

    if (targetPhase) {
      // Restore from phase if available
      const phaseSuccess = await phaseManager.restorePhase(targetPhase);
      if (phaseSuccess) {
        // Run post-restore QA checks
        const postRestoreChecks = await qaSystem.runChecks();
        console.log('Post-restore checks:', postRestoreChecks);

        const phaseInfo = phaseManager.getPhaseInfo(targetPhase);
        toast.success('Successfully restored to v2.4');
        
        return {
          success: true,
          timestamp: phaseInfo?.timestamp || null,
          version: phaseInfo?.metadata?.version || null
        };
      }
    }

    // Fall back to backup restore if phase restore fails
    const success = await restoreFromTimestamp(targetDate);
    
    if (success) {
      // Run post-restore QA checks
      const postRestoreChecks = await qaSystem.runChecks();
      console.log('Post-restore checks:', postRestoreChecks);

      toast.success('Successfully restored to v2.4');
      return {
        success: true,
        timestamp: targetDate.toISOString()
      };
    } else {
      throw new Error('No backup found for the specified date');
    }
  } catch (error) {
    console.error('Restore error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Restore failed: ${message}`);
    return {
      success: false,
      timestamp: null,
      error: message
    };
  }
}