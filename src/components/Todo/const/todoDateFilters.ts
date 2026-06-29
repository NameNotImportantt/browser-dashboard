export enum TodoDateFilter {
    All = 'all',
    Today = 'today',
    Upcoming = 'upcoming',
    Overdue = 'overdue',
}

export const TODO_DATE_FILTERS = [
    TodoDateFilter.All,
    TodoDateFilter.Today,
    TodoDateFilter.Upcoming,
    TodoDateFilter.Overdue,
];
