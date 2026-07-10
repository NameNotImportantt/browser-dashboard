import {lazy, memo, Suspense, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Moon, Sun} from 'lucide-react';
import {
    Loader,
    QuickLinks,
    ScreenMenu,
    screenMenuStyles,
    SearchCore,
    TodayPanel,
    TopBar,
    WorkspaceBar,
    type ScreenId,
} from '@/components';
import {useDashboardCore, useSettings} from '@/dashboard';
import {isBackupReminderOverdue} from '@/data/settings';
import {t} from '@/i18n';
import {BackupReminderCard} from './components/BackupReminderCard/BackupReminderCard';
import {KeyboardHelpAction} from './components/KeyboardHelpAction/KeyboardHelpAction';
import styles from './HomePage.module.scss';
import {canPrefetchScreen, preloadScreen, screenLoaders} from './screenLoaders';
import {useHomePageKeyboardShortcuts} from './useHomePageKeyboardShortcuts';

const TodoWidget = lazy(screenLoaders.todo);
const HabitsWidget = lazy(screenLoaders.habits);
const NotesWidget = lazy(screenLoaders.notes);
const SettingsPanel = lazy(screenLoaders.settings);

interface ScreenLoadingFallbackProps {
  label: string;
}

function ScreenLoadingFallback({label}: ScreenLoadingFallbackProps) {
    const fallbackClassName = clsx('card', styles.widgetFallback);

    return (
        <section className={fallbackClassName}>
            <Loader label={label} />
        </section>
    );
}

export const HomePage = memo(function HomePage() {
    const {hasRenderableSnapshot} = useDashboardCore();
    const {settings, locale, setTheme} = useSettings();
    const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
    const [searchFocusRequestId, setSearchFocusRequestId] = useState(0);
    const [dismissRequestId, setDismissRequestId] = useState(0);
    const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
    const theme = settings.theme;
    const shouldShowBackupReminder = isBackupReminderOverdue(settings);
    const glowOrbClassName = clsx('glow', styles.glowOrb);
    const shouldShowKeyboardHelp = activeScreen !== 'settings';
    const shouldShowFooter = activeScreen !== 'settings';

    const contentClassName = clsx(styles.content, {
        [styles.contentHome]: activeScreen === 'home',
    });

    const homeLayoutClassName = clsx(styles.contentPane, styles.homeLayout);
    const screenPanelClassName = clsx(styles.contentPane, styles.screenPanel);
    const habitsScreenPanelClassName = clsx(styles.contentPane, styles.screenPanel, styles.screenPanelHabits);
    const notesScreenPanelClassName = clsx(styles.contentPane, styles.screenPanel, styles.screenPanelWide);

    const handleScreenPrefetch = useCallback((screenId: ScreenId) => {
        if (!hasRenderableSnapshot || screenId === 'home' || !canPrefetchScreen()) {
            return;
        }

        void preloadScreen(screenId).catch(() => undefined);
    }, [hasRenderableSnapshot]);

    const handleOpenSettings = () => setActiveScreen('settings');
    const handleToggleTheme = () => void setTheme(theme === 'dark' ? 'light' : 'dark');
    const handleOpenKeyboardHelp = () => setIsKeyboardHelpOpen(true);
    const handleCloseKeyboardHelp = () => setIsKeyboardHelpOpen(false);

    useEffect(() => {
        if (!shouldShowKeyboardHelp) {
            setIsKeyboardHelpOpen(false);
        }
    }, [shouldShowKeyboardHelp]);

    useHomePageKeyboardShortcuts({
        onSelectScreen: setActiveScreen,
        onFocusSearch: () => {
            setSearchFocusRequestId(currentRequestId => currentRequestId + 1);
        },
        onOpenHelp: () => {
            if (shouldShowKeyboardHelp) {
                setIsKeyboardHelpOpen(true);
            }
        },
        onDismissTransientUi: () => {
            setIsKeyboardHelpOpen(false);
            setDismissRequestId(currentRequestId => currentRequestId + 1);
        },
    });

    return (
        <main className={styles.shell}>
            <div className={glowOrbClassName} aria-hidden />

            <header className={styles.headerRow}>
                <TopBar />

                <div className={styles.headerActions}>
                    <ScreenMenu
                        activeScreen={activeScreen}
                        locale={locale}
                        onSelect={setActiveScreen}
                        onPrefetch={handleScreenPrefetch}
                    />
                    <button
                        type="button"
                        className={screenMenuStyles.iconButton}
                        onClick={handleToggleTheme}
                        aria-label={t(locale, 'toggleTheme')}
                    >
                        {theme === 'dark' ? <Sun size={16} strokeWidth={2.25} /> : <Moon size={16} strokeWidth={2.25} />}
                    </button>
                </div>
            </header>

            <div className={contentClassName}>
                {activeScreen === 'home' ? (
                    <div className={homeLayoutClassName}>
                        <div className={styles.homeMain}>
                            <div className={styles.homeMainCenter}>
                                <div className={styles.homeMainStack}>
                                    {shouldShowBackupReminder ? (
                                        <BackupReminderCard onOpenSettings={handleOpenSettings} />
                                    ) : null}
                                    <SearchCore focusRequestId={searchFocusRequestId} dismissRequestId={dismissRequestId} />
                                    <QuickLinks dismissRequestId={dismissRequestId} />
                                </div>
                            </div>
                        </div>
                        <aside className={styles.homeSidebar}>
                            <TodayPanel />
                        </aside>
                    </div>
                ) : null}

                {activeScreen === 'todo' ? (
                    <div className={screenPanelClassName}>
                        <Suspense fallback={<ScreenLoadingFallback label={t(locale, 'loadingTodo')} />}>
                            <TodoWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'habits' ? (
                    <div className={habitsScreenPanelClassName}>
                        <Suspense fallback={<ScreenLoadingFallback label={t(locale, 'loadingHabits')} />}>
                            <HabitsWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'notes' ? (
                    <div className={notesScreenPanelClassName}>
                        <Suspense fallback={<ScreenLoadingFallback label={t(locale, 'loadingNotes')} />}>
                            <NotesWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'settings' ? (
                    <Suspense fallback={<ScreenLoadingFallback label={t(locale, 'loadingSettings')} />}>
                        <SettingsPanel dismissRequestId={dismissRequestId} />
                    </Suspense>
                ) : null}
            </div>

            {shouldShowFooter ? (
                <footer className={styles.footerRow}>
                    {shouldShowKeyboardHelp ? (
                        <KeyboardHelpAction
                            locale={locale}
                            open={isKeyboardHelpOpen}
                            onOpen={handleOpenKeyboardHelp}
                            onClose={handleCloseKeyboardHelp}
                        />
                    ) : null}
                    <WorkspaceBar dismissRequestId={dismissRequestId} />
                </footer>
            ) : null}
        </main>
    );
});
