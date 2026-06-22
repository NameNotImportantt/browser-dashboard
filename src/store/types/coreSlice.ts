import type {Snapshot} from '@/data';

export interface CoreSlice {
  loading: boolean;
  error: string | null;
  snapshot: Snapshot | null;
  activeWorkspaceId: string | null;
  init: () => Promise<void>;
  refresh: () => Promise<void>;
}
