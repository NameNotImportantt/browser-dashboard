import {Home, type LucideIcon} from 'lucide-react';
import type {ScreenId} from './ScreenMenu';

export const SCREENS: Array<{
  id: ScreenId;
  labelKey: 'navHome' | 'navTodo' | 'navHabits' | 'navNotes';
  icon?: LucideIcon;
}> = [
    {id: 'home', labelKey: 'navHome', icon: Home},
    {id: 'todo', labelKey: 'navTodo'},
    {id: 'habits', labelKey: 'navHabits'},
    {id: 'notes', labelKey: 'navNotes'},
];
