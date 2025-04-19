import { backupManager } from './backupManager';
import { phaseManager } from './phaseManager';
import { toast } from 'react-hot-toast';
import { commandHandler } from './commandHandler';

export async function restoreFromTimestamp(targetDate: Date): Promise<boolean> {
  try {
    // Lock files during restore
    await commandHandler.execute('lock:all');

    // Get all backups
    const backups = await backupManager.listPhases();
    
    // Find backup closest to target date
    const closestBackup = backups
      .map(id => backupManager.getPhaseInfo(id))
      .filter(backup => backup && new Date(backup.timestamp) <= targetDate)
      .sort((a, b) => new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime())[0];

    if (!closestBackup) {
      toast.error('No backup found before the specified date');
      return false;
    }

    // Attempt restore
    const success = await backupManager.restorePhase(closestBackup.id);
    
    if (success) {
      toast.success(`Successfully restored to backup from ${new Date(closestBackup.timestamp).toLocaleString()}`);
      // Refresh application state
      await commandHandler.execute('app:refresh');
      return true;
    } else {
      toast.error('Failed to restore from backup');
      return false;
    }
  } catch (error) {
    console.error('Restore error:', error);
    toast.error('Failed to restore from backup');
    return false;
  } finally {
    // Release locks
    await commandHandler.execute('unlock:all');
  }
}