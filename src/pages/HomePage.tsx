import {lazy, memo, Suspense, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Moon, Sun} from 'lucide-react';
import {isBackupReminderOverdue, t} from '@/app';
import {
    Loader,
    QuickLinks,
    ScreenMenu,
    screenMenuStyles,
    SearchCore,
    SettingsPanel,
    TodayPanel,
    TodoWidget,
    TopBar,
    WorkspaceBar,
    type ScreenId,
} from '@/components';
import {useSettings} from '@/dashboard';
import {BackupReminderCard} from './components/BackupReminderCard/BackupReminderCard';
import {KeyboardHelpAction} from './components/KeyboardHelpAction/KeyboardHelpAction';
import styles from './HomePage.module.scss';
import {useHomePageKeyboardShortcuts} from './useHomePageKeyboardShortcuts';

const HabitsWidget = lazy(() => import('@/components').then(module => ({default: module.HabitsWidget})));
const NotesWidget = lazy(() => import('@/components').then(module => ({default: module.NotesWidget})));

export const HomePage = memo(function HomePage() {
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

    const widgetFallbackClassName = clsx('card', styles.widgetFallback);

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
                    <ScreenMenu activeScreen={activeScreen} locale={locale} onSelect={setActiveScreen} />
                    <button
                        type="button"
                        className={screenMenuStyles.iconButton}
                        onClick={() => void setTheme(theme === 'dark' ? 'light' : 'dark')}
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
                                        <BackupReminderCard onOpenSettings={() => setActiveScreen('settings')} />
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
                        <TodoWidget />
                    </div>
                ) : null}

                {activeScreen === 'habits' ? (
                    <div className={screenPanelClassName}>
                        <Suspense
                            fallback={(
                                <section className={widgetFallbackClassName}>
                                    <Loader label={t(locale, 'loadingHabits')} />
                                </section>
                            )}
                        >
                            <HabitsWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'notes' ? (
                    <div className={screenPanelClassName}>
                        <Suspense
                            fallback={(
                                <section className={widgetFallbackClassName}>
                                    <Loader label={t(locale, 'loadingNotes')} />
                                </section>
                            )}
                        >
                            <NotesWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'settings' ? (
                    <SettingsPanel dismissRequestId={dismissRequestId} />
                ) : null}
            </div>

            {shouldShowFooter ? (
                <footer className={styles.footerRow}>
                    {shouldShowKeyboardHelp ? (
                        <KeyboardHelpAction
                            locale={locale}
                            open={isKeyboardHelpOpen}
                            onOpen={() => setIsKeyboardHelpOpen(true)}
                            onClose={() => setIsKeyboardHelpOpen(false)}
                        />
                    ) : null}
                    <WorkspaceBar dismissRequestId={dismissRequestId} />
                </footer>
            ) : null}
        </main>
    );
});
