import { commands } from './approvalSystem';
import { toast } from 'react-hot-toast';

type CommandType = 'app' | 'page' | 'component';

interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

class CommandHandler {
  private static instance: CommandHandler;
  private history: string[] = [];

  private constructor() {}

  static getInstance(): CommandHandler {
    if (!CommandHandler.instance) {
      CommandHandler.instance = new CommandHandler();
    }
    return CommandHandler.instance;
  }

  async approve(type: CommandType, path: string, content: string): Promise<CommandResult> {
    try {
      // Add command to history
      this.history.push(`${type}:approve ${path}`);

      // Map app approval to all components
      if (type === 'app') {
        const results = await Promise.all([
          commands['page:approve'](path, content),
          commands['component:approve'](path, content),
          commands['style:approve'](path, content)
        ]);

        const success = results.every(result => result);
        return {
          success,
          message: success 
            ? 'Application approved successfully' 
            : 'Failed to approve all application components'
        };
      }

      // Handle page and component approvals
      const commandKey = `${type}:approve`;
      if (!commands[commandKey]) {
        throw new Error(`Unknown command: ${commandKey}`);
      }

      const result = await commands[commandKey](path, content);
      
      return {
        success: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`,
        data: result
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Command execution failed';
      toast.error(message);
      return { success: false, message };
    }
  }

  async getStatus(type: CommandType, path: string): Promise<CommandResult> {
    try {
      const commandKey = `${type}:status`;
      if (!commands[commandKey]) {
        throw new Error(`Unknown command: ${commandKey}`);
      }

      const result = await commands[commandKey](path);
      return {
        success: true,
        message: `${type} status retrieved`,
        data: result
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get status';
      return { success: false, message };
    }
  }

  async lock(type: CommandType, path: string): Promise<CommandResult> {
    try {
      const commandKey = `${type}:lock`;
      if (!commands[commandKey]) {
        throw new Error(`Unknown command: ${commandKey}`);
      }

      await commands[commandKey](path);
      return {
        success: true,
        message: `${type} locked successfully`
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to lock';
      return { success: false, message };
    }
  }

  async rollback(path: string, version?: number): Promise<CommandResult> {
    try {
      const result = await commands['component:rollback'](path, version);
      return {
        success: true,
        message: 'Rollback successful',
        data: result
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Rollback failed';
      return { success: false, message };
    }
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

// Export singleton instance
export const commandHandler = CommandHandler.getInstance();