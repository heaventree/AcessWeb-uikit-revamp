import { FileLock } from './fileLock';
import { DiffManager } from './diffManager';
import { RollbackManager } from './rollbackManager';

type ApprovalType = 'page' | 'component' | 'style';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalRecord {
  type: ApprovalType;
  path: string;
  hash: string;
  status: ApprovalStatus;
  approvedAt?: Date;
  approvedBy?: string;
  version: number;
}

export class ApprovalSystem {
  private static instance: ApprovalSystem;
  private fileLock: FileLock;
  private diffManager: DiffManager;
  private rollbackManager: RollbackManager;
  private approvals: Map<string, ApprovalRecord> = new Map();
  
  private constructor() {
    this.fileLock = new FileLock();
    this.diffManager = DiffManager.getInstance();
    this.rollbackManager = RollbackManager.getInstance();
  }

  static getInstance(): ApprovalSystem {
    if (!ApprovalSystem.instance) {
      ApprovalSystem.instance = new ApprovalSystem();
    }
    return ApprovalSystem.instance;
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

  async approve(type: ApprovalType, path: string, content: string): Promise<boolean> {
    try {
      // Acquire lock
      const hasLock = await this.fileLock.acquireLock(path);
      if (!hasLock) {
        throw new Error(`Could not acquire lock for ${path}`);
      }

      const hash = this.generateHash(content);
      const key = `${type}:${path}`;
      
      // Create or update approval record
      const existing = this.approvals.get(key);
      const record: ApprovalRecord = {
        type,
        path,
        hash,
        status: 'approved',
        approvedAt: new Date(),
        version: (existing?.version || 0) + 1
      };

      this.approvals.set(key, record);
      
      // Cache the approved content
      this.diffManager.getDiff(path, content);
      
      // Save state for rollback
      if (type === 'component') {
        this.rollbackManager.saveState(path, content);
      }
      
      return true;
    } finally {
      this.fileLock.releaseLock(path);
    }
  }

  async rollbackComponent(path: string, version?: number): Promise<string | null> {
    const state = this.rollbackManager.rollback(path, version);
    if (!state) return null;
    
    // Update approval record
    const key = `component:${path}`;
    const record = this.approvals.get(key);
    if (record) {
      record.hash = this.generateHash(state.content);
      record.version = state.version;
      this.approvals.set(key, record);
    }
    
    return state.content;
  }

  async getComponentHistory(path: string): Promise<RollbackState[]> {
    return this.rollbackManager.getStates(path);
  }

  async checkApproval(type: ApprovalType, path: string, content: string): Promise<boolean> {
    const key = `${type}:${path}`;
    const record = this.approvals.get(key);
    
    if (!record || record.status !== 'approved') {
      return false;
    }

    const hash = this.generateHash(content);
    return record.hash === hash;
  }

  async getApprovalStatus(type: ApprovalType, path: string): Promise<ApprovalRecord | null> {
    const key = `${type}:${path}`;
    return this.approvals.get(key) || null;
  }

  async lockApprovedContent(type: ApprovalType, path: string): Promise<void> {
    const key = `${type}:${path}`;
    const record = this.approvals.get(key);
    
    if (!record || record.status !== 'approved') {
      throw new Error(`Content at ${path} is not approved`);
    }

    // Acquire permanent lock
    await this.fileLock.acquireLock(path, 0);
  }

  async unlockContent(type: ApprovalType, path: string): Promise<void> {
    this.fileLock.releaseLock(path);
  }
}

// Command Registry
export const commands = {
  // Approval Commands
  'page:approve': async (path: string, content: string) => {
    const system = ApprovalSystem.getInstance();
    return system.approve('page', path, content);
  },
  'component:approve': async (path: string, content: string) => {
    const system = ApprovalSystem.getInstance();
    return system.approve('component', path, content);
  },
  'style:approve': async (path: string, content: string) => {
    const system = ApprovalSystem.getInstance();
    return system.approve('style', path, content);
  },

  // Lock Commands  
  'page:lock': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.lockApprovedContent('page', path);
  },
  'component:lock': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.lockApprovedContent('component', path);
  },
  'style:lock': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.lockApprovedContent('style', path);
  },

  // Status Commands
  'page:status': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.getApprovalStatus('page', path);
  },
  'component:status': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.getApprovalStatus('component', path);
  },
  'style:status': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.getApprovalStatus('style', path);
  },

  // Rollback Commands
  'component:rollback': async (path: string, version?: number) => {
    const system = ApprovalSystem.getInstance();
    return system.rollbackComponent(path, version);
  },
  'component:history': async (path: string) => {
    const system = ApprovalSystem.getInstance();
    return system.getComponentHistory(path);
  }
};

// Command Documentation
export const commandDocs = {
  'Approval Commands': {
    'page:approve': 'Approve and lock a page layout',
    'component:approve': 'Approve and lock a component',
    'style:approve': 'Approve and lock styles',
  },
  'Lock Commands': {
    'page:lock': 'Lock an approved page',
    'component:lock': 'Lock an approved component',
    'style:lock': 'Lock approved styles',
  },
  'Status Commands': {
    'page:status': 'Check page approval status',
    'component:status': 'Check component approval status',
    'style:status': 'Check style approval status'
  },
  'Rollback Commands': {
    'component:rollback': 'Rollback component to previous or specific version',
    'component:history': 'View component version history'
  },
  'Additional Commands': {
    'unlock': 'Unlock a previously locked file',
    'check': 'Check if changes match approved version',
    'version': 'Show version history of approvals'
  }
};