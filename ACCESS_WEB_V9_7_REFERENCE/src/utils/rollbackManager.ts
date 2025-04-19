import { DiffManager } from './diffManager';

interface RollbackState {
  componentId: string;
  version: number;
  content: string;
  timestamp: number;
  hash: string;
}

export class RollbackManager {
  private static instance: RollbackManager;
  private states: Map<string, RollbackState[]>;
  private diffManager: DiffManager;
  private readonly maxStates = 10; // Keep last 10 states per component

  private constructor() {
    this.states = new Map();
    this.diffManager = DiffManager.getInstance();
  }

  static getInstance(): RollbackManager {
    if (!RollbackManager.instance) {
      RollbackManager.instance = new RollbackManager();
    }
    return RollbackManager.instance;
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

  saveState(componentId: string, content: string): void {
    const states = this.states.get(componentId) || [];
    const hash = this.generateHash(content);

    // Don't save if content hasn't changed
    if (states.length > 0 && states[states.length - 1].hash === hash) {
      return;
    }

    const newState: RollbackState = {
      componentId,
      version: states.length + 1,
      content,
      timestamp: Date.now(),
      hash
    };

    states.push(newState);

    // Keep only the last maxStates states
    if (states.length > this.maxStates) {
      states.shift();
    }

    this.states.set(componentId, states);
  }

  rollback(componentId: string, version?: number): RollbackState | null {
    const states = this.states.get(componentId);
    if (!states || states.length === 0) {
      return null;
    }

    if (version) {
      const state = states.find(s => s.version === version);
      return state || null;
    }

    // Default to previous state if version not specified
    return states[states.length - 2] || null;
  }

  getStates(componentId: string): RollbackState[] {
    return this.states.get(componentId) || [];
  }

  clearStates(componentId: string): void {
    this.states.delete(componentId);
  }

  hasStates(componentId: string): boolean {
    const states = this.states.get(componentId);
    return Boolean(states && states.length > 0);
  }
}