export interface WorkspacesSlice {
  selectWorkspace: (workspaceId: string) => Promise<void>;
  addWorkspace: (name: string) => Promise<void>;
  renameWorkspace: (workspaceId: string, name: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
}
