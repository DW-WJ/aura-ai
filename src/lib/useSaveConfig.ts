import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type QuizType = 'aura' | 'nbti' | 'sbti';

interface SaveConfigParams {
  quizType: QuizType;
  name: string;
  configText: string;
  statsJson?: Record<string, unknown>;
  answersJson?: Record<string, unknown>;
}

export function useSaveConfig(params: SaveConfigParams | null) {
  const { data: session, status: authStatus } = useSession();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [configId, setConfigId] = useState<string | null>(null);

  const save = useCallback(async () => {
    if (!params || !session?.user) return;

    setSaveStatus('saving');
    try {
      // Get user's first workspace
      const wsRes = await fetch('/api/workspaces');
      if (!wsRes.ok) throw new Error('Failed to fetch workspaces');
      const wsData = await wsRes.json();
      const workspaceId = wsData.workspaces?.[0]?.id;
      if (!workspaceId) throw new Error('No workspace found');

      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
        },
        body: JSON.stringify({
          name: params.name,
          configText: params.configText,
          answersJson: params.answersJson || {},
          statsJson: params.statsJson || { quizType: params.quizType },
          isPublic: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      const data = await res.json();
      setConfigId(data.config?.id || null);
      setSaveStatus('saved');
    } catch (e) {
      console.error('Save config error:', e);
      setSaveStatus('error');
    }
  }, [params, session?.user]);

  // Auto-save when params are ready and user is authenticated
  useEffect(() => {
    if (params && session?.user && saveStatus === 'idle') {
      save();
    }
  }, [params, session?.user, saveStatus, save]);

  return { saveStatus, configId, retry: save, isAuthenticated: !!session?.user };
}
