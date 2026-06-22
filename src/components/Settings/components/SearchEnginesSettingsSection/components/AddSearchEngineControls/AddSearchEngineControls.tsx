import {useMemo, useState} from 'react';
import {getSearchEngineOptions, SEARCH_URL_HINT, t} from '@/app';
import {Select} from '@/components/Select';
import settingsStyles from '../../../../SettingsPanel.module.scss';
import styles from './AddSearchEngineControls.module.scss';
import type {AppLocale, AppSettings} from '@/db';

export interface AddSearchEngineControlsProps {
  locale: AppLocale;
  settings: AppSettings;
  onSelectActiveEngine: (engineId: string) => Promise<void>;
  onAddCustomEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  onRemoveCustomEngine: (engineId: string) => Promise<void>;
}

export function AddSearchEngineControls({
    locale,
    settings,
    onSelectActiveEngine,
    onAddCustomEngine,
    onRemoveCustomEngine,
}: AddSearchEngineControlsProps) {
    const [engineName, setEngineName] = useState('');
    const [engineUrl, setEngineUrl] = useState('');
    const searchOptions = getSearchEngineOptions(settings.customSearchEngines);

    const searchEngineSelectOptions = useMemo(
        () => searchOptions.map(option => ({value: option.id, label: option.name})),
        [searchOptions],
    );

    const addEngine = async () => {
        await onAddCustomEngine({name: engineName, urlTemplate: engineUrl});
        setEngineName('');
        setEngineUrl('');
    };

    return (
        <>
            <div className={settingsStyles.field}>
                <span className={settingsStyles.fieldLabel}>{t(locale, 'currentSearchEngines')}</span>
                <Select
                    value={settings.activeSearchEngineId}
                    options={searchEngineSelectOptions}
                    onChange={value => void onSelectActiveEngine(value)}
                    ariaLabel={t(locale, 'currentSearchEngines')}
                />
            </div>

            <div className={styles.customEngineForm}>
                <input
                    value={engineName}
                    onChange={event => setEngineName(event.target.value)}
                    placeholder={t(locale, 'searchEngineNamePlaceholder')}
                />
                <input
                    value={engineUrl}
                    onChange={event => setEngineUrl(event.target.value)}
                    placeholder={t(locale, 'searchEngineLinkPlaceholder')}
                />
                <small className={settingsStyles.hint}>
                    {t(locale, 'customSearchFormat')} <code>{SEARCH_URL_HINT}</code>
                </small>
                <button type="button" className="primary" onClick={() => void addEngine()}>
                    {t(locale, 'addSearchEngine')}
                </button>
            </div>

            {settings.customSearchEngines.length > 0 ? (
                <ul className={styles.engineList}>
                    {settings.customSearchEngines.map(engine => (
                        <li className={styles.engineItem} key={engine.id}>
                            <span className={styles.engineItemText}>
                                {engine.name}: {engine.urlTemplate}
                            </span>
                            <button
                                type="button"
                                className={styles.dangerButton}
                                onClick={() => void onRemoveCustomEngine(engine.id)}
                            >
                                {t(locale, 'remove')}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    );
}
