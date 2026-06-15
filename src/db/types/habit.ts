export interface Habit {
  id: string;
  workspaceId: string;
  title: string;
  completionDates: string[];
  position: number;
  createdAt: number;
}
