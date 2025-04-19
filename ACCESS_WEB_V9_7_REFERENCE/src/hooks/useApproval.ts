import { useState } from 'react';
import { commandHandler } from '../utils/commandHandler';
import { toast } from 'react-hot-toast';

type ApprovalType = 'app' | 'page' | 'component';

export function useApproval() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = async (type: ApprovalType, path: string, content: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await commandHandler.approve(type, path, content);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setError(result.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Approval failed';
      toast.error(message);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getStatus = async (type: ApprovalType, path: string) => {
    try {
      return await commandHandler.getStatus(type, path);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get status';
      setError(message);
      return { success: false, message };
    }
  };

  const lock = async (type: ApprovalType, path: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await commandHandler.lock(type, path);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setError(result.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lock failed';
      toast.error(message);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const rollback = async (path: string, version?: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await commandHandler.rollback(path, version);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setError(result.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Rollback failed';
      toast.error(message);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    approve,
    getStatus,
    lock,
    rollback,
    loading,
    error
  };
}