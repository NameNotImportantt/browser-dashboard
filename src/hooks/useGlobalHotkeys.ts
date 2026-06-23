import {useEffect} from 'react';

export interface GlobalHotkeyDefinition {
  key: string;
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  preventDefault?: boolean;
  allowInEditable?: boolean;
  ignoreRepeat?: boolean;
  handler: (event: KeyboardEvent) => void;
}

function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    const tagName = target.tagName;

    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}

function matchesModifier(expected: boolean | undefined, actual: boolean) {
    return expected === undefined || expected === actual;
}

function matchesHotkey(event: KeyboardEvent, hotkey: GlobalHotkeyDefinition) {
    if (event.key !== hotkey.key) {
        if (!hotkey.code || event.code !== hotkey.code) {
            return false;
        }
    } else if (hotkey.code && event.code !== hotkey.code) {
        return false;
    }

    if (!matchesModifier(hotkey.altKey, event.altKey)) {
        return false;
    }

    if (!matchesModifier(hotkey.ctrlKey, event.ctrlKey)) {
        return false;
    }

    if (!matchesModifier(hotkey.metaKey, event.metaKey)) {
        return false;
    }

    if (!matchesModifier(hotkey.shiftKey, event.shiftKey)) {
        return false;
    }

    return !(hotkey.ignoreRepeat && event.repeat);
}

export function useGlobalHotkeys(hotkeys: GlobalHotkeyDefinition[]) {
    useEffect(() => {
        if (hotkeys.length === 0) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const isEditable = isEditableTarget(event.target);

            for (const hotkey of hotkeys) {
                if (isEditable && !hotkey.allowInEditable) {
                    continue;
                }

                if (!matchesHotkey(event, hotkey)) {
                    continue;
                }

                if (hotkey.preventDefault) {
                    event.preventDefault();
                }

                hotkey.handler(event);
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [hotkeys]);
}
