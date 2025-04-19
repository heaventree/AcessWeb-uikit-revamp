import { commandHandler } from './commandHandler';
import { backupManager } from './backupManager';
import { phaseManager } from './phaseManager';
import { toast } from 'react-hot-toast';

interface QACheck {
  id: string;
  name: string;
  description: string;
  check: () => Promise<boolean>;
  fix?: () => Promise<void>;
}

interface RestorePoint {
  id: string;
  timestamp: string;
  type: 'auto' | 'manual';
  status: 'stable' | 'unstable';
}

class QASystem {
  private static instance: QASystem;
  private restorePoints: RestorePoint[] = [];
  private checks: QACheck[] = [];

  private constructor() {
    this.initializeChecks();
  }

  static getInstance(): QASystem {
    if (!QASystem.instance) {
      QASystem.instance = new QASystem();
    }
    return QASystem.instance;
  }

  private initializeChecks() {
    this.checks = [
      // Dependency Check
      {
        id: 'dependencies',
        name: 'Dependency Check',
        description: 'Verify all required dependencies are loaded',
        check: async () => {
          try {
            // Check core dependencies
            const requiredDeps = [
              'react', 'react-dom', 'react-router-dom', '@tanstack/react-query',
              'lucide-react', '@tanstack/react-query-devtools', '@tanstack/query-core',
              '@tanstack/query-sync-storage-persister', '@tanstack/react-query-persist-client',
              'idb-keyval', 'localforage'
            ];

            for (const dep of requiredDeps) {
              // @ts-ignore
              if (!window[dep]) {
                console.error(`Missing dependency: ${dep}`);
                return false;
              }
            }
            return true;
          } catch (error) {
            console.error('Dependency check failed:', error);
            return false;
          }
        },
        fix: async () => {
          await commandHandler.execute('dependencies:reinstall');
        }
      },

      // Route Check
      {
        id: 'routes',
        name: 'Route Check',
        description: 'Verify all routes are correctly configured',
        check: async () => {
          try {
            const routes = document.querySelectorAll('a[href]');
            const invalidRoutes = Array.from(routes).filter(route => {
              const href = (route as HTMLAnchorElement).href;
              return href.includes('undefined') || href.includes('null');
            });
            return invalidRoutes.length === 0;
          } catch (error) {
            console.error('Route check failed:', error);
            return false;
          }
        }
      },

      // Database Check
      {
        id: 'database',
        name: 'Database Check', 
        description: 'Verify database connection and tables',
        check: async () => {
          try {
            const tables = [
              'users', 'subscriptions', 'api_keys', 'webhooks',
              'monitoring_configs', 'monitoring_alerts'
            ];

            for (const table of tables) {
              const { data, error } = await window.supabase
                .from(table)
                .select('count')
                .limit(1);

              if (error) {
                console.error(`Table check failed for ${table}:`, error);
                return false;
              }
            }
            return true;
          } catch (error) {
            console.error('Database check failed:', error);
            return false;
          }
        }
      },

      // Content Check
      {
        id: 'content',
        name: 'Content Check',
        description: 'Verify content routes and loading',
        check: async () => {
          try {
            const contentRoutes = [
              '/blog', '/help', '/docs/api'
            ];

            for (const route of contentRoutes) {
              const response = await fetch(route);
              if (!response.ok) {
                console.error(`Content route check failed for ${route}`);
                return false;
              }
            }
            return true;
          } catch (error) {
            console.error('Content check failed:', error);
            return false;
          }
        }
      }
    ];
  }

  // Create restore point
  async createRestorePoint(type: 'auto' | 'manual' = 'auto'): Promise<string> {
    try {
      const id = `restore-${Date.now()}`;
      const timestamp = new Date().toISOString();
      const version = '2.4';
      const description = type === 'manual' ? 'Manual restore point - Broken version' : 'Auto restore point';

      // Run QA checks
      const checkResults = await this.runChecks();
      const status = checkResults.every(r => r.passed) ? 'stable' : 'unstable';

      // Create backup
      await backupManager.createPhaseBackup(id, [], {
        version,
        description,
        author: 'system',
        tags: ['restore-point', type, status, 'broken']
      });

      // Save restore point
      const restorePoint: RestorePoint = {
        id,
        timestamp,
        type,
        status: 'unstable' // Force unstable status for broken version
      };
      this.restorePoints.push(restorePoint);

      return id;
    } catch (error) {
      console.error('Failed to create restore point:', error);
      throw error;
    }
  }

  // Restore to point
  async restoreToPoint(id: string): Promise<boolean> {
    try {
      const restorePoint = this.restorePoints.find(rp => rp.id === id);
      if (!restorePoint) {
        throw new Error('Restore point not found');
      }

      // Restore from backup
      const success = await backupManager.restorePhase(id);
      if (!success) {
        throw new Error('Failed to restore from backup');
      }

      // Run QA checks after restore
      const checkResults = await this.runChecks();
      if (!checkResults.every(r => r.passed)) {
        throw new Error('QA checks failed after restore');
      }

      toast.success('Successfully restored to previous state');
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Failed to restore previous state');
      return false;
    }
  }

  // Run all checks
  async runChecks(): Promise<Array<{ id: string; passed: boolean }>> {
    const results = [];
    for (const check of this.checks) {
      try {
        const passed = await check.check();
        results.push({ id: check.id, passed });

        if (!passed && check.fix) {
          await check.fix();
          // Re-run check after fix
          const fixedResult = await check.check();
          results[results.length - 1].passed = fixedResult;
        }
      } catch (error) {
        console.error(`Check ${check.id} failed:`, error);
        results.push({ id: check.id, passed: false });
      }
    }
    return results;
  }

  // Get restore points
  getRestorePoints(): RestorePoint[] {
    return this.restorePoints;
  }

  // Get stable restore points
  getStablePoints(): RestorePoint[] {
    return this.restorePoints.filter(rp => rp.status === 'stable');
  }
}

export const qaSystem = QASystem.getInstance();