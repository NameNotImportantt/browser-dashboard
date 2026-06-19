<p align="right">
  <a href="./DEVELOPERS.en.md">English</a> | <strong>Русский</strong> |
  <a href="./README.ru.md">Документация пользователя</a>
</p>

# Руководство разработчика

Внутренняя документация для работы с **Browser Dashboard**.

## Требования

- [Bun](https://bun.sh/)
- Node.js `20.19+` или `22.12+` (требование Vite)

## Быстрый старт

```bash
git clone git@github.com:NameNotImportantt/browser-dashboard.git
cd browser-dashboard
bun install
bun run dev
```

Dev-сервер поднимается через Vite (по умолчанию `http://localhost:5173`) с hot reload.

## Скрипты

| Команда | Описание |
| --- | --- |
| `bun run dev` | Генерация `.d.ts` для SCSS-модулей и запуск Vite dev-сервера |
| `bun run build` | Проверка типов (`tsc -b`) и production-сборка |
| `bun run start` | Локальный предпросмотр production-сборки |

## Результат сборки

Production-сборка использует `vite-plugin-singlefile`. На выходе — **один файл**:

```
dist/index.html
```

JavaScript, CSS и favicon встроены в HTML. Именно этот файл попадает в Releases для пользователей.

## Структура проекта

```
src/
├── app/           # App shell, i18n, утилиты поиска, тема
├── components/    # UI-виджеты (SearchCore, TodoWidget, SettingsPanel, …)
├── db/            # Схема Dexie и доменные типы
├── hooks/         # useDashboardData, useClock
├── pages/         # Разметка HomePage
└── frontend.tsx   # Точка входа
```

### Слой данных

- Имя базы: `browser-home-page-db`
- ORM: [Dexie](https://dexie.org/) (IndexedDB)
- Доменные типы — в `src/db/types/*` (отдельный файл на сущность)
- Типы props компонентов — в `src/components/<Name>/types/*`
- Типы страниц — в `src/pages/types/*`

### Правила стилей

- Только `*.module.scss` — глобальный CSS запрещён
- Стили рядом с компонентом: `Component.tsx` + `Component.module.scss`
- `.d.ts` для SCSS генерируются `typed-scss-modules` при `dev`

## Архитектурные заметки

- **Состояние**: `useDashboardData` загружает snapshot из IndexedDB и отдаёт обработчики мутаций. Компоненты получают props через `AppShell` → `HomePage`.
- **Workspaces**: большинство сущностей привязаны к `workspaceId`. Настройки глобальные (таблица `settings`, ключ `app`).
- **Lazy loading**: `HabitsWidget` и `NotesWidget` подгружаются через `React.lazy`.
- **Погода**: геокодинг и прогноз Open-Meteo; TTL кэша — 30 минут (`WEATHER_CACHE_TTL_MS`).
- **Подсказки поиска**: сначала локальная история, затем Google Suggest через JSONP (`suggestqueries.google.com`).
- **i18n**: лёгкий helper в `src/app/i18n.ts`; локали `ru` и `en`.

## Дизайн-направление

UI опирается на тёмную атмосферу новелл «Начало после конца» и «Теневой раб»: магический минимализм, мягкое свечение, фиолетово-синие акценты, чистые карточки, минимум визуального шума.

## Конвенции для контрибьюторов

- Использовать `bun` для установки и скриптов
- Не добавлять тяжёлые UI-фреймворки без обсуждения
- Не создавать общий `types/domain.ts` — типы сущностей в `src/db/types/`
- Предпочитать небольшие сфокусированные diff'ы; сохранять быстрый отклик UI
- Не коммитить и не создавать ветки без явной просьбы мейнтейнеров

Подробнее — в [руководстве для контрибьюторов](../CONTRIBUTING.md) (на английском).

## Лицензия

Проект распространяется под [лицензией MIT](../LICENSE). Copyright (c) 2026 NameNotImportantt.

Участвуя в проекте, вы соглашаетесь лицензировать свой вклад на тех же условиях.

Соблюдайте [Кодекс поведения](../CODE_OF_CONDUCT.md) во всех пространствах проекта.

## Ссылки

- [Документация пользователя (English)](../README.md)
- [Документация пользователя (Русский)](./README.ru.md)
- [Лицензия MIT](../LICENSE)
- [Кодекс поведения](../CODE_OF_CONDUCT.md)
- [Contributing](../CONTRIBUTING.md)
