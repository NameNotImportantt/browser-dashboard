import { useMemo, useState, type FormEvent } from "react";
import { reorderIds, t } from "@/app";
import { Checkbox } from "@/components/Checkbox";
import { Select } from "@/components/Select";
import type { TodoPriority, TodoWidgetProps } from "./types/TodoWidgetProps";
import styles from "./TodoWidget.module.scss";

export function TodoWidget({ todos, locale, onAdd, onToggle, onDelete, onReorder }: TodoWidgetProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const todoIds = useMemo(() => todos.map(item => item.id), [todos]);
  const priorityOptions = useMemo(
    () => [
      { value: "low", label: t(locale, "priorityLow") },
      { value: "medium", label: t(locale, "priorityMedium") },
      { value: "high", label: t(locale, "priorityHigh") },
    ],
    [locale],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onAdd({
      title,
      priority,
      dueDate: dueDate || null,
    });
    setTitle("");
    setDueDate("");
  };

  const dropOn = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const ordered = reorderIds(todoIds, draggedId, targetId);
    setDraggedId(null);
    await onReorder(ordered);
  };

  return (
    <section className={`card ${styles.todoWidget}`}>
      <header className={styles.widgetHeader}>
        <h2>TODO</h2>
      </header>

      <form className={styles.stackForm} onSubmit={submit}>
        <input className={styles.inputField} value={title} onChange={event => setTitle(event.target.value)} placeholder="Новая задача" required />
        <div className={styles.inlineRow}>
          <Select
            className={styles.inputField}
            value={priority}
            options={priorityOptions}
            onChange={value => setPriority(value as TodoPriority)}
            ariaLabel="Приоритет"
          />
          <input className={styles.inputField} type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} />
        </div>
        <button className="primary" type="submit">
          Добавить задачу
        </button>
      </form>

      <ul className={`${styles.widgetList} ${styles.todoList}`}>
        {todos.map(todo => (
          <li
            className={`${styles.todoItem} ${priorityItemClass(todo.priority)}`}
            key={todo.id}
            draggable
            onDragStart={() => setDraggedId(todo.id)}
            onDragOver={event => event.preventDefault()}
            onDrop={() => {
              void dropOn(todo.id);
            }}
          >
            <Checkbox
              className={styles.todoLabel}
              checked={todo.completed}
              onChange={() => void onToggle(todo.id)}
              label={<span className={todo.completed ? styles.isCompleted : ""}>{todo.title}</span>}
            />

            <div className={styles.todoMeta}>
              <small className={`${styles.todoBadge} ${priorityBadgeClass(todo.priority)}`}>{priorityLabel(todo.priority, locale)}</small>
              {todo.dueDate ? <small className={styles.todoBadge}>{todo.dueDate}</small> : null}
              <button type="button" className={styles.dangerButton} onClick={() => void onDelete(todo.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function priorityItemClass(priority: TodoPriority) {
  if (priority === "high") return styles.priorityHigh;
  if (priority === "low") return styles.priorityLow;
  return styles.priorityMedium;
}

function priorityBadgeClass(priority: TodoPriority) {
  if (priority === "high") return styles.badgeHigh;
  if (priority === "low") return styles.badgeLow;
  return styles.badgeMedium;
}

function priorityLabel(priority: TodoPriority, locale: TodoWidgetProps["locale"]) {
  if (priority === "high") return t(locale, "priorityHigh");
  if (priority === "low") return t(locale, "priorityLow");
  return t(locale, "priorityMedium");
}
