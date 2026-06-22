import {useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import {ChevronDown} from 'lucide-react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
}

type ListboxPosition = {
  top: number;
  left: number;
  width: number;
};

export function Select({value, options, onChange, ariaLabel, className, triggerClassName}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [listboxPosition, setListboxPosition] = useState<ListboxPosition | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const listboxId = useId();

    const selected = options.find(option => option.value === value);
    const displayLabel = selected?.label ?? value;

    const close = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
        setListboxPosition(null);
    }, []);

    const updateListboxPosition = useCallback(() => {
        const trigger = triggerRef.current;

        if (!trigger) {return;}

        const rect = trigger.getBoundingClientRect();

        setListboxPosition({
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    const selectAt = useCallback(
        (index: number) => {
            const option = options[index];

            if (!option) {return;}

            onChange(option.value);
            close();
        },
        [options, onChange, close],
    );

    useLayoutEffect(() => {
        if (!isOpen) {return;}

        updateListboxPosition();
        window.addEventListener('resize', updateListboxPosition);
        window.addEventListener('scroll', updateListboxPosition, true);

        return () => {
            window.removeEventListener('resize', updateListboxPosition);
            window.removeEventListener('scroll', updateListboxPosition, true);
        };
    }, [isOpen, updateListboxPosition]);

    useEffect(() => {
        if (!isOpen) {return;}

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (containerRef.current?.contains(target)) {return;}

            if (listboxRef.current?.contains(target)) {return;}

            close();
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [isOpen, close]);

    useEffect(() => {
        if (!isOpen) {return;}

        const index = options.findIndex(option => option.value === value);

        setActiveIndex(index >= 0 ? index : 0);
    }, [isOpen, options, value]);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!isOpen) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsOpen(true);
            }

            return;
        }

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                close();
                break;
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex(index => (index + 1) % options.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex(index => (index - 1 + options.length) % options.length);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();

                if (activeIndex >= 0) {selectAt(activeIndex);}

                break;
            case 'Tab':
                close();
                break;
            default:
                break;
        }
    };

    const rootClassName = clsx(styles.select, className);
    const triggerClassNameValue = clsx(styles.trigger, triggerClassName);
    const chevronClassName = clsx(styles.chevron, {[styles.chevronOpen]: isOpen});

    const listboxStyle: CSSProperties | undefined = listboxPosition
        ? {
            top: listboxPosition.top,
            left: listboxPosition.left,
            width: listboxPosition.width,
        }
        : undefined;

    const listbox =
    isOpen && listboxPosition ? (
        <ul
            ref={listboxRef}
            id={listboxId}
            className={styles.listbox}
            role="listbox"
            aria-label={ariaLabel}
            style={listboxStyle}
        >
            {options.map((option, index) => {
                const optionClassName = clsx(styles.option, {
                    [styles.optionSelected]: option.value === value,
                    [styles.optionActive]: index === activeIndex,
                });

                return (
                    <li
                        key={option.value}
                        id={`${listboxId}-option-${index}`}
                        role="option"
                        aria-selected={option.value === value}
                        className={optionClassName}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectAt(index)}
                    >
                        {option.label}
                    </li>
                );
            })}
        </ul>
    ) : null;

    return (
        <div ref={containerRef} className={rootClassName}>
            <button
                ref={triggerRef}
                type="button"
                className={triggerClassNameValue}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                onClick={() => setIsOpen(open => !open)}
                onKeyDown={handleKeyDown}
            >
                <span className={styles.triggerLabel}>{displayLabel}</span>
                <ChevronDown
                    className={chevronClassName}
                    size={16}
                    strokeWidth={2.25}
                    aria-hidden
                />
            </button>

            {listbox ? createPortal(listbox, document.body) : null}
        </div>
    );
}
