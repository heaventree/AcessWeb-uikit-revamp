import { FileLock } from './fileLock';
import { DiffManager } from './diffManager';
import { RollbackManager } from './rollbackManager';
import localforage from 'localforage';
import { get, set } from 'idb-keyval';

interface PhaseBackup {
  id: string;
  timestamp: string;
  files: {
    path: string;
    hash: string;
    content: string;
  }[];
  metadata: {
    version: string;
    description: string;
    author: string;
    tags: string[];
  };
}

interface BackupConfig {
  maxBackups: number;
  backupInterval: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

export class BackupManager {
  private static instance: BackupManager;
  private fileLock: FileLock;
  private diffManager: DiffManager;
  private rollbackManager: RollbackManager;
  private backups: Map<string, PhaseBackup> = new Map();
  private config: BackupConfig = {
    maxBackups: 10,
    backupInterval: 1000 * 60 * 60, // 1 hour
    compressionEnabled: true,
    encryptionEnabled: true
  };
  private backupStore: LocalForage;
  private metaStore: LocalForage;
  
  private constructor() {
    this.fileLock = new FileLock();
    this.diffManager = DiffManager.getInstance();
    this.rollbackManager = RollbackManager.getInstance();
    
    // Initialize storage
    this.backupStore = localforage.createInstance({
      name: 'backups',
      storeName: 'backups'
    });
    
    this.metaStore = localforage.createInstance({
      name: 'backups',
      storeName: 'metadata'
    });
    
    // Start backup scheduler
    this.startBackupScheduler();
  }

  private async startBackupScheduler() {
    // Load stored config
    const storedConfig = await this.metaStore.getItem<BackupConfig>('config');
    if (storedConfig) {
      this.config = { ...this.config, ...storedConfig };
    }

    // Schedule periodic backups
    setInterval(() => {
      this.pruneOldBackups();
    }, this.config.backupInterval);
  }

  private async pruneOldBackups() {
    const keys = await this.backupStore.keys();
    if (keys.length > this.config.maxBackups) {
      // Sort by timestamp and remove oldest
      const backups = await Promise.all(
        keys.map(async key => ({
          key,
          backup: await this.backupStore.getItem<PhaseBackup>(key)
        }))
      );

      backups
        .sort((a, b) => new Date(a.backup?.timestamp || 0).getTime() - new Date(b.backup?.timestamp || 0).getTime())
        .slice(0, keys.length - this.config.maxBackups)
        .forEach(({ key }) => this.backupStore.removeItem(key));
    }
  }

  async updateConfig(newConfig: Partial<BackupConfig>) {
    this.config = { ...this.config, ...newConfig };
    await this.metaStore.setItem('config', this.config);
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  async createPhaseBackup(
    phaseId: string,
    files: { path: string; content: string }[],
    metadata: PhaseBackup['metadata']
  ): Promise<boolean> {
    try {
      // Lock all files during backup
      const locks = await Promise.all(
        files.map(file => this.fileLock.acquireLock(file.path))
      );

      if (locks.some(lock => !lock)) {
        throw new Error('Could not acquire all file locks');
      }

      const backup: PhaseBackup = {
        id: phaseId,
        timestamp: new Date().toISOString(),
        files: files.map(file => ({
          path: file.path,
          hash: this.generateHash(file.content),
          content: file.content
        })),
        metadata
      };

      // Store backup
      if (this.config.compressionEnabled) {
        backup.files = await this.compressFiles(backup.files);
      }
      
      if (this.config.encryptionEnabled) {
        await this.encryptBackup(backup);
      }
      
      await this.backupStore.setItem(phaseId, backup);

      // Save state for each component
      files.forEach(file => {
        if (file.path.includes('/components/')) {
          this.rollbackManager.saveState(file.path, file.content);
        }
      });

      return true;
    } finally {
      // Release all locks
      files.forEach(file => this.fileLock.releaseLock(file.path));
    }
  }

  private async compressFiles(files: PhaseBackup['files']) {
    // Implement compression logic
    return files;
  }

  private async encryptBackup(backup: PhaseBackup) {
    // Implement encryption logic
  }

  async restorePhase(phaseId: string): Promise<boolean> {
    const backup = await this.backupStore.getItem<PhaseBackup>(phaseId);
    if (!backup) {
      throw new Error(`No backup found for phase ${phaseId}`);
    }

    try {
      // Lock all files during restore
      const locks = await Promise.all(
        backup.files.map(file => this.fileLock.acquireLock(file.path))
      );

      if (locks.some(lock => !lock)) {
        throw new Error('Could not acquire all file locks');
      }

      // Restore each file
      backup.files.forEach(file => {
        // Cache the restored content
        this.diffManager.getDiff(file.path, file.content);
        
        // Save component states
        if (file.path.includes('/components/')) {
          this.rollbackManager.saveState(file.path, file.content);
        }
      });

      return true;
    } finally {
      // Release all locks
      backup.files.forEach(file => this.fileLock.releaseLock(file.path));
    }
  }

  getPhaseInfo(phaseId: string): PhaseBackup | null {
    return this.backupStore.getItem(phaseId);
  }

  listPhases(): string[] {
    return this.listBackups();
  }
}

// Export singleton instance
export const backupManager = BackupManager.getInstance();