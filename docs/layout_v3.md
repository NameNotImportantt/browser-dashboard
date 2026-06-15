# UI Layout — browser-home-page (v3)

## 🧠 Общая концепция

Search-first personal OS

Вся система вращается вокруг поиска, а не вокруг дашборда.

---

## 🧱 Общая структура

App (AppShell)
└── HomePage
    ├── TopBar (HUD)
    ├── ScreenMenu (top-right navigation)
    ├── SearchCore (center)
    ├── QuickLinks
    ├── TodayPanel (Todo + Habits)
    └── WorkspaceBar (bottom-right)

---

## 🌐 Layout схема

┌────────────────────────────────────────────┐
│ TOP BAR (time / date / weather)           │
│                                MENU       │
├────────────────────────────────────────────┤
│                                            │
│               SEARCH CORE                  │
│     [ search input ................. ]     │
│     [ google ▼ | duckduckgo ]             │
│                                            │
│            QUICK LINKS                     │
│   GitHub · Gmail · ChatGPT · YouTube      │
│   + Add Link                               │
│                                            │
│     TODAY (TODO + HABITS unified)         │
│   • task 1                                │
│   • task 2                                │
│   🔥 reading streak                       │
│                                            │
├────────────────────────────────────────────┤
│                 | PERSONAL | WORK | ...    │
└────────────────────────────────────────────┘

---

## 🟣 TopBar (HUD)

Роль: системная информация

Содержимое:
- время
- дата
- погода

Пример:
09:41   Mon 15 Jun   ☀ 23°

---

## ☰ ScreenMenu (top-right)

Роль: навигация между экранами

HOME | TODO | HABITS | NOTES

---

## 🔍 SearchCore (центр)

Роль: главный вход в систему

[ search input ................. ]   [ Google ▼ ]

Enter → поиск
Dropdown → Google / DuckDuckGo

---

## 🔗 QuickLinks

GitHub · Gmail · ChatGPT · YouTube · Docs
+ Add Link

---

## 📋 TodayPanel

Today
• task 1
• task 2

Habits
🔥 reading streak
🔥 sport streak

---

## ⌨ WorkspaceBar

PERSONAL | WORK | READING

---

## 🧠 Архитектура

Data Layer:
- workspaces

UI Layer:
- screens

---

## 🎯 Иерархия

1. Search
2. Links
3. Today
4. Workspace
5. Menu

