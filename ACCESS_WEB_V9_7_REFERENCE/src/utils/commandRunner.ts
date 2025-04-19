import { commands } from './approvalSystem';

interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export class CommandRunner {
  private static instance: CommandRunner;
  private history: string[] = [];

  private constructor() {}

  static getInstance(): CommandRunner {
    if (!CommandRunner.instance) {
      CommandRunner.instance = new CommandRunner();
    }
    return CommandRunner.instance;
  }

  async execute(command: string, ...args: any[]): Promise<CommandResult> {
    try {
      // Add command to history
      this.history.push(`${command} ${args.join(' ')}`);

      // Parse command
      const [type, action] = command.split(':');
      const commandKey = `${type}:${action}`;

      // Check if command exists
      if (!commands[commandKey]) {
        throw new Error(`Unknown command: ${command}`);
      }

      // Execute command
      const result = await commands[commandKey](...args);

      return {
        success: true,
        message: `Successfully executed ${command}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Command execution failed'
      };
    }
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

// Example usage:
/*
const runner = CommandRunner.getInstance();

// Approve a page
await runner.execute('page:approve', '/pages/Home.tsx', pageContent);

// Lock a component
await runner.execute('component:lock', '/components/Button.tsx');

// Check style status
await runner.execute('style:status', '/styles/main.css');
*/