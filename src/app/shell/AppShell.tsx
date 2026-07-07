import {useEffect} from 'react';
import {Loader, UndoSnackbar} from '@/components';
import {useDashboardCore, useDashboardShellEffects, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {HomePage} from '@/pages';
import {BootPhase} from '@/store';
import styles from './AppShell.module.scss';

export function AppShell() {
    const {bootPhase, hasRenderableSnapshot, error, init, refresh} = useDashboardCore();
    const {locale} = useSettings();

    useEffect(() => {
        void init();
    }, [init]);

    useDashboardShellEffects();

    if (!hasRenderableSnapshot && bootPhase !== BootPhase.Error) {
        return (
            <main>
                <Loader variant="fullscreen" label={t(locale, 'appLoading')} />
            </main>
        );
    }

    return (
        <>
            {!hasRenderableSnapshot && error ? (
                <main className={styles.statusView}>
                    <p>
                        {t(locale, 'appLoadError')} {error}
                    </p>
                    <button type="button" onClick={() => void refresh()}>
                        {t(locale, 'retry')}
                    </button>
                </main>
            ) : null}

            <HomePage />
            <UndoSnackbar />
        </>
    );
}
