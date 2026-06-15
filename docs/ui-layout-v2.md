# UI Layout — browser-home-page (v2 corrected)

## Общая структура

```
App (AppShell)
└── HomePage
    ├── Glow (background decor)
    ├── TopBar (status only)
    ├── Hero (entry point)
    ├── WorkspaceTabs (state switcher)
    └── DashboardGrid
        ├── TodoWidget (primary)
        ├── HabitsWidget
        ├── CalendarWidget
        ├── BookmarksWidget
        └── NotesWidget
```

---

## 🟣 TopBar (исправленный)

### Роль:
Только состояние системы

### Содержимое:
- время
- дата
- погода
- тема

❌ Убрано:
- настройки
- поисковик
- dropdown логика

---

## ✨ Hero (упрощённый)

### Роль:
Вход в систему

```
Доброе утро, Leo

[ Search ]

Сегодня:
• максимум 3 задачи
```

❌ Убрано:
- расширенный focus panel
- большие списки задач

---

## 🧭 WorkspaceTabs (упрощённый)

### Роль:
Переключение состояния

```
[ Personal ] [ Work ] [ Reading ]
```

❌ Убрано:
- формы
- добавление внутри блока

---

## 🧩 DashboardGrid (иерархия)

### Логика важности:

| уровень | виджеты |
|--------|--------|
| core | Todo |
| control | Habits, Calendar |
| access | Bookmarks |
| memory | Notes |

---

### Layout:

```
┌──────────────┬──────────────┬──────────────┐
│ TODO         │ HABITS       │ BOOKMARKS    │
├──────────────┼──────────────┼──────────────┤
│ CALENDAR     │ NOTES        │ (optional)   │
└──────────────┴──────────────┴──────────────┘
```

---

## 📌 Ключевое отличие от v1

- убрана перегрузка HERO
- WorkspaceTabs стал “тонким”
- TopBar стал статусным
- добавлена иерархия виджетов
- появился “core focus” системы

---

## 🧠 Итоговая идея

Personal OS with state-driven UI
