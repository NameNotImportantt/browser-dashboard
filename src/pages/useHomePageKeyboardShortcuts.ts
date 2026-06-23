import {useMemo} from 'react';
import {useGlobalHotkeys} from '@/hooks';
import type {ScreenId} from '@/components';

interface UseHomePageKeyboardShortcutsOptions {
  onSelectScreen: (screen: ScreenId) => void;
  onFocusSearch: () => void;
  onDismissTransientUi: () => void;
}

export function useHomePageKeyboardShortcuts({
    onSelectScreen,
    onFocusSearch,
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
        [onFocusSearch, onSelectScreen, onDismissTransientUi],
    );

    useGlobalHotkeys(hotkeys);
}
