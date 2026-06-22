import {useEffect} from 'react';
import {useDashboardCore, useDashboardShellEffects, useSettings} from '@/dashboard';
import {HomePage} from '@/pages';
import styles from './AppShell.module.scss';
import {t} from './i18n';

export function AppShell() {
    const {loading, error, init, refresh} = useDashboardCore();
    const {locale} = useSettings();

    useEffect(() => {
        void init();
    }, [init]);

    useDashboardShellEffects();

    if (loading) {
        return <main className={styles.statusView}>{t(locale, 'appLoading')}</main>;
    }

    if (error) {
        return (
            <main className={styles.statusView}>
                <p>
                    {t(locale, 'appLoadError')} {error}
                </p>
                <button type="button" onClick={() => void refresh()}>
                    {t(locale, 'retry')}
                </button>
            </main>
        );
    }

    return <HomePage />;
}
