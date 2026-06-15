import { useMemo, useState, type FormEvent } from "react";
import { reorderIds } from "@/app/utils";
import type { TodoPriority, TodoWidgetProps } from "@/components/Todo/types/TodoWidgetProps";
import styles from "./TodoWidget.module.scss";

export function TodoWidget({ todos, onAdd, onToggle, onDelete, onReorder }: TodoWidgetProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const todoIds = useMemo(() => todos.map(item => item.id), [todos]);

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
          <select className={styles.inputField} value={priority} onChange={event => setPriority(event.target.value as TodoPriority)}>
            <option value="low">Низкий приоритет</option>
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <input className={styles.inputField} type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} />
        </div>
        <button className="primary" type="submit">
          Добавить задачу
        </button>
      </form>

      <ul className={`${styles.widgetList} ${styles.todoList}`}>
        {todos.map(todo => (
          <li
            className={styles.todoItem}
            key={todo.id}
            draggable
            onDragStart={() => setDraggedId(todo.id)}
            onDragOver={event => event.preventDefault()}
            onDrop={() => {
              void dropOn(todo.id);
            }}
          >
            <label className={styles.todoLabel}>
              <input type="checkbox" checked={todo.completed} onChange={() => void onToggle(todo.id)} />
              <span className={todo.completed ? styles.isCompleted : ""}>{todo.title}</span>
            </label>

            <div className={styles.todoMeta}>
              <small className={styles.todoBadge}>{priorityLabel(todo.priority)}</small>
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

function priorityLabel(priority: TodoPriority) {
  if (priority === "high") return "Высокий";
  if (priority === "low") return "Низкий";
  return "Средний";
}
