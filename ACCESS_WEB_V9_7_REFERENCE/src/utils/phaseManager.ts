import { backupManager } from './backupManager';
import { commandHandler } from './commandHandler';
import { toast } from 'react-hot-toast';

interface PhaseConfig {
  id: string;
  version: string;
  description: string;
  author: string;
  tags: string[];
}

export class PhaseManager {
  private static instance: PhaseManager;
  private currentPhase: string | null = null;
  
  private constructor() {}

  static getInstance(): PhaseManager {
    if (!PhaseManager.instance) {
      PhaseManager.instance = new PhaseManager();
    }
    return PhaseManager.instance;
  }

  async completePhase(files: { path: string; content: string }[], config: PhaseConfig): Promise<boolean> {
    try {
      // Create backup
      const success = await backupManager.createPhaseBackup(config.id, files, {
        version: config.version,
        description: config.description,
        author: config.author,
        tags: config.tags
      });

      if (!success) {
        throw new Error('Failed to create phase backup');
      }

      // Approve all components
      await Promise.all(
        files
          .filter(file => file.path.includes('/components/'))
          .map(file => commandHandler.approve('component', file.path, file.content))
      );

      // Lock approved files
      await Promise.all(
        files.map(file => commandHandler.lock(
          file.path.includes('/components/') ? 'component' : 'page',
          file.path
        ))
      );

      this.currentPhase = config.id;
      
      toast.success(`Phase ${config.id} completed and backed up successfully`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete phase';
      toast.error(message);
      return false;
    }
  }

  async restorePhase(phaseId: string): Promise<boolean> {
    try {
      const success = await backupManager.restorePhase(phaseId);
      if (success) {
        this.currentPhase = phaseId;
        toast.success(`Phase ${phaseId} restored successfully`);
      }
      return success;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to restore phase';
      toast.error(message);
      return false;
    }
  }

  getCurrentPhase(): string | null {
    return this.currentPhase;
  }

  getPhaseInfo(phaseId: string) {
    return backupManager.getPhaseInfo(phaseId);
  }

  listPhases(): string[] {
    return backupManager.listPhases();
  }
}

// Export singleton instance
export const phaseManager = PhaseManager.getInstance();