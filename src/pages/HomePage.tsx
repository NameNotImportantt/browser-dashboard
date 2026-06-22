import {lazy, memo, Suspense, useState} from 'react';
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

const HabitsWidget = lazy(() => import('@/components').then(module => ({default: module.HabitsWidget})));
const NotesWidget = lazy(() => import('@/components').then(module => ({default: module.NotesWidget})));

export const HomePage = memo(function HomePage() {
    const {settings, locale, setTheme} = useSettings();
    const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
    const theme = settings.theme;

    return (
        <main className={styles.shell}>
            <div className={`glow ${styles.glowOrb}`} aria-hidden />

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

            <div
                className={`${styles.content} ${activeScreen === 'home' ? styles.contentHome : ''} ${activeScreen === 'settings' ? styles.contentSettings : ''}`}
            >
                {activeScreen === 'home' ? (
                    <div className={styles.homeLayout}>
                        <div className={styles.homeMain}>
                            <div className={styles.homeMainCenter}>
                                <div className={styles.homeMainStack}>
                                    <SearchCore />
                                    <QuickLinks />
                                </div>
                            </div>
                        </div>
                        <aside className={styles.homeSidebar}>
                            <TodayPanel />
                        </aside>
                    </div>
                ) : null}

                {activeScreen === 'todo' ? (
                    <div className={styles.screenPanel}>
                        <TodoWidget />
                    </div>
                ) : null}

                {activeScreen === 'habits' ? (
                    <div className={styles.screenPanel}>
                        <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>{t(locale, 'loadingHabits')}</section>}>
                            <HabitsWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'notes' ? (
                    <div className={styles.screenPanel}>
                        <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>{t(locale, 'loadingNotes')}</section>}>
                            <NotesWidget />
                        </Suspense>
                    </div>
                ) : null}

                {activeScreen === 'settings' ? (
                    <div className={`${styles.screenPanel} ${styles.screenPanelWide} ${styles.screenPanelSettings}`}>
                        <SettingsPanel />
                    </div>
                ) : null}
            </div>

            <footer className={styles.footerRow}>
                <WorkspaceBar />
            </footer>
        </main>
    );
});
