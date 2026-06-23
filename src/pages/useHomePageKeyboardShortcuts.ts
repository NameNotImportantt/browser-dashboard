import {useMemo} from 'react';
import {useGlobalHotkeys} from '@/hooks';
import type {ScreenId} from '@/components';

interface UseHomePageKeyboardShortcutsOptions {
  onSelectScreen: (screen: ScreenId) => void;
  onFocusSearch: () => void;
  onOpenHelp: () => void;
  onDismissTransientUi: () => void;
}

export function useHomePageKeyboardShortcuts({
    onSelectScreen,
    onFocusSearch,
    onOpenHelp,
    onDismissTransientUi,
}: UseHomePageKeyboardShortcutsOptions) {
    const dismissAndBlurActiveElement = () => {
        const activeElement = document.activeElement;

        if (activeElement instanceof HTMLElement) {
            activeElement.blur();
        }

        onDismissTransientUi();
    };

    const hotkeys = useMemo(
        () => [
            {
                key: '/',
                code: 'Slash',
                shiftKey: false,
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onSelectScreen('home');
                    onFocusSearch();
                },
            },
            {
                key: 'h',
                code: 'KeyH',
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onSelectScreen('habits');
                },
            },
            {
                key: 't',
                code: 'KeyT',
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onSelectScreen('todo');
                },
            },
            {
                key: 's',
                code: 'KeyS',
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onSelectScreen('settings');
                },
            },
            {
                key: 'n',
                code: 'KeyN',
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onSelectScreen('notes');
                },
            },
            {
                key: '?',
                preventDefault: true,
                ignoreRepeat: true,
                handler: () => {
                    onOpenHelp();
                },
            },
            {
                key: 'Escape',
                allowInEditable: true,
                ignoreRepeat: true,
                handler: (event: KeyboardEvent) => {
                    if (event.target instanceof HTMLElement) {
                        event.preventDefault();
                    }

                    dismissAndBlurActiveElement();
                },
            },
        ],
        [onFocusSearch, onOpenHelp, onSelectScreen, onDismissTransientUi],
    );

    useGlobalHotkeys(hotkeys);
}
