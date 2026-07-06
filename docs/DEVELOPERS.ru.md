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
| `bun run build` | Проверка типов (`tsc -b`) и single-file production-сборка |
| `bun run build:multi` | Проверка типов (`tsc -b`) и обычная multi-file Vite-сборка |
| `bun run start` | Локальный предпросмотр single-file production-сборки |
| `bun run start:vite` | Локальный предпросмотр обычной multi-file сборки |

## Результат сборки

Production-сборка использует `vite-plugin-singlefile`. На выходе — **один файл**:

```
dist/index.html
```

JavaScript, CSS и favicon встроены в HTML. Именно этот файл попадает в Releases для пользователей.

Обычная multi-file сборка выводится отдельно в:

```
dist-vite/
```

Этот output сохраняет обычные JS/CSS/assets файлы и предназначен для локального static hosting, Docker и следующих шагов с PWA/live preview.

PWA-поддержка относится только к обычной multi-file сборке. Она рассчитана на `https://` или `http://localhost`, но не на single-file `file://` релиз.

## Docker

Docker-образ собирается для обычного multi-file build, а не для single-file release-артефакта.

```bash
docker build -t browser-dashboard .
docker run -d --rm --name browser-dashboard-app -p 8080:80 browser-dashboard
```

После запуска приложение доступно по адресу `http://localhost:8080`.

Имя `browser-dashboard-app` берется из `--name`. Если параметр не указать, Docker сам сгенерирует случайное имя контейнера.

Полезные команды:

```bash
docker ps
docker logs browser-dashboard-app
docker stop browser-dashboard-app
```

## Структура проекта

```
src/
├── app/           # App shell, i18n, утилиты поиска, тема
├── components/    # UI-виджеты (SearchCore, TodoWidget, SettingsPanel, …)
├── dashboard/     # Доменные хуки для доступа UI к данным и actions
├── data/          # Snapshot, repositories и сервисы поверх Dexie
├── db/            # Схема Dexie и доменные типы
├── hooks/         # Общие хуки и реэкспорт dashboard-хуков
├── pages/         # Разметка HomePage
├── store/         # Zustand store, slices и типы store
└── frontend.tsx   # Точка входа
```

### Слой данных

- Имя базы: `browser-home-page-db`
- ORM: [Dexie](https://dexie.org/) (IndexedDB)
- Dexie вызывается из `src/data/*`: snapshot, repositories, weather/search services
- Состояние dashboard хранится в Zustand (`src/store/dashboardStore.ts`)
- Derived-данные вычисляются в доменных хуках рядом с UI-потребителем.
- Компоненты получают данные через доменные хуки из `src/dashboard/hooks/*`
- Доменные типы — в `src/db/types/*` (отдельный файл на сущность)
- Типы Zustand slices — в `src/store/types/*` (отдельный файл на slice/сущность)
- Типы props компонентов хранятся в файле компонента сразу после импортов
- Типы страниц хранятся рядом со страницей, если они действительно нужны

### Правила стилей

- Только `*.module.scss` — глобальный CSS запрещён
- Стили рядом с компонентом: `Component.tsx` + `Component.module.scss`
- `.d.ts` для SCSS генерируются `typed-scss-modules` при `dev`

## Архитектурные заметки

- **Состояние**: единый Zustand store хранит `snapshot`, `activeWorkspaceId`, `loading` и `error`. Domain slices вызывают repositories и затем обновляют snapshot через `refresh()`.
- **UI-доступ**: виджеты не получают CRUD callbacks через `HomePage`; они используют доменные хуки (`useTodos`, `useSettings`, `useBookmarks` и т.д.).
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
