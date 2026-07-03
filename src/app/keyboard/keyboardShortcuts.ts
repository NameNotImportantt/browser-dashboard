import type {MessageKey} from '@/i18n';

export interface KeyboardShortcutDefinition {
    id: string;
    descriptionKey: MessageKey;
    keys: string[];
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcutDefinition[] = [
    {
        id: 'search',
        keys: ['/'],
        descriptionKey: 'keyboardShortcutFocusSearch',
    },
    {
        id: 'help',
        keys: ['?'],
        descriptionKey: 'keyboardShortcutOpenHelp',
    },
    {
        id: 'todo',
        keys: ['T'],
        descriptionKey: 'navTodo',
    },
    {
        id: 'habits',
        keys: ['H'],
        descriptionKey: 'navHabits',
    },
    {
        id: 'notes',
        keys: ['N'],
        descriptionKey: 'navNotes',
    },
    {
        id: 'settings',
        keys: ['S'],
        descriptionKey: 'settings',
    },
    {
        id: 'dismiss',
        keys: ['Esc'],
        descriptionKey: 'keyboardShortcutDismiss',
    },
];
