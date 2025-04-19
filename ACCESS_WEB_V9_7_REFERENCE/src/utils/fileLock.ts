interface LockFile {
  pid: number;
  timestamp: number;
}

export class FileLock {
  private locks: Map<string, LockFile> = new Map();
  
  constructor() {}

  async acquireLock(filename: string, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();

    while (true) {
      try {
        const lock = this.locks.get(filename);
        if (lock) {
          // Check if lock is stale (older than 5 minutes)
          if (Date.now() - lock.timestamp > 300000) {
            this.locks.delete(filename);
          } else {
            if (Date.now() - startTime > timeout) {
              return false;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }
        }
          
        // Create lock
        this.locks.set(filename, {
          pid: process.pid,
          timestamp: Date.now()
        });

        return true;
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  releaseLock(filename: string): void {
    const lock = this.locks.get(filename);
    if (lock && lock.pid === process.pid) {
      this.locks.delete(filename);
    }
  }

  clearAllLocks(): void {
    this.locks.clear();
  }
}