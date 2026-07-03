import {useEffect} from 'react';
import {Loader, UndoSnackbar} from '@/components';
import {useDashboardCore, useDashboardShellEffects, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {HomePage} from '@/pages';
import styles from './AppShell.module.scss';

export function AppShell() {
    const {loading, error, init, refresh} = useDashboardCore();
    const {locale} = useSettings();

    useEffect(() => {
        void init();
    }, [init]);

    useDashboardShellEffects();

    if (loading) {
        return (
            <main>
                <Loader variant="fullscreen" label={t(locale, 'appLoading')} />
            </main>
        );
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

    return (
        <>
            <HomePage />
            <UndoSnackbar />
        </>
    );
}
