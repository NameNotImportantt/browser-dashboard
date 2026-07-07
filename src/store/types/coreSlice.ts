import type {BootPhase} from './bootPhase';
import type {Snapshot} from '@/data';

export interface CoreSlice {
  bootPhase: BootPhase;
  hasRenderableSnapshot: boolean;
  deferredLoading: boolean;
  deferredReady: boolean;
  error: string | null;
  snapshot: Snapshot | null;
  activeWorkspaceId: string | null;
  init: () => Promise<void>;
  hydrateDeferredData: () => Promise<void>;
  refresh: () => Promise<void>;
  importDashboardBackupJson: (json: string) => Promise<void>;
}
