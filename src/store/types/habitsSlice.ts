export interface HabitsSlice {
  addHabit: (title: string) => Promise<void>;
  toggleHabitToday: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}
