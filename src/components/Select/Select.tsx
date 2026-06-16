import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "./types/SelectProps";
import styles from "./Select.module.scss";

export function Select({ value, options, onChange, ariaLabel, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find(option => option.value === value);
  const displayLabel = selected?.label ?? value;

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectAt = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      onChange(option.value);
      close();
    },
    [options, onChange, close],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const index = options.findIndex(option => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
  }, [isOpen, options, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex(index => (index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(index => (index - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0) selectAt(activeIndex);
        break;
      case "Tab":
        close();
        break;
      default:
        break;
    }
  };

  const rootClassName = [styles.select, className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={rootClassName}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen(open => !open)}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.triggerLabel}>{displayLabel}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`.trim()}
          size={16}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul id={listboxId} className={styles.listbox} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const optionClassName = [
              styles.option,
              option.value === value ? styles.optionSelected : "",
              index === activeIndex ? styles.optionActive : "",
            ]
              .filter(Boolean)
              .join(" ");

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
      ) : null}
    </div>
  );
}
