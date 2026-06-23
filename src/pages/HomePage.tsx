import {lazy, memo, Suspense, useState} from 'react';
import clsx from 'clsx';
import {Moon, Sun} from 'lucide-react';
import {t} from '@/app';
import {
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
import styles from './HomePage.module.scss';
import {useHomePageKeyboardShortcuts} from './useHomePageKeyboardShortcuts';

const HabitsWidget = lazy(() => import('@/components').then(module => ({default: module.HabitsWidget})));
const NotesWidget = lazy(() => import('@/components').then(module => ({default: module.NotesWidget})));

export const HomePage = memo(function HomePage() {
    const {settings, locale, setTheme} = useSettings();
    const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
    const [searchFocusRequestId, setSearchFocusRequestId] = useState(0);
    const [dismissRequestId, setDismissRequestId] = useState(0);
    const theme = settings.theme;
    const glowOrbClassName = clsx('glow', styles.glowOrb);

    const contentClassName = clsx(styles.content, {
        [styles.contentHome]: activeScreen === 'home',
        [styles.contentSettings]: activeScreen === 'settings',
    });

    const homeLayoutClassName = clsx(styles.contentPane, styles.homeLayout);
    const screenPanelClassName = clsx(styles.contentPane, styles.screenPanel);

    const screenPanelSettingsClassName = clsx(
        styles.contentPane,
        styles.screenPanel,
        styles.screenPanelWide,
        styles.screenPanelSettings,
    );

    const widgetFallbackClassName = clsx('card', styles.widgetFallback);

    useHomePageKeyboardShortcuts({
        onSelectScreen: setActiveScreen,
        onFocusSearch: () => {
            setSearchFocusRequestId(currentRequestId => currentRequestId + 1);
        },
        onDismissTransientUi: () => {
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
                        <Suspense fallback={<section className={widgetFallbackClassName}>{t(locale, 'loadingHabits')}</section>}>
                            <HabitsWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'notes' ? (
                    <div className={screenPanelClassName}>
                        <Suspense fallback={<section className={widgetFallbackClassName}>{t(locale, 'loadingNotes')}</section>}>
                            <NotesWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'settings' ? (
                    <div className={screenPanelSettingsClassName}>
                        <SettingsPanel dismissRequestId={dismissRequestId} />
                    </div>
                ) : null}
            </div>

            <footer className={styles.footerRow}>
                <WorkspaceBar dismissRequestId={dismissRequestId} />
            </footer>
        </main>
    );
});
