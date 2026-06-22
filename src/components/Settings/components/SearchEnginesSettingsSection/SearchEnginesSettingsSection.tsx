import {useMemo, useState} from 'react';
import {getSearchEngineOptions, SEARCH_URL_HINT, t} from '@/app';
import {Select} from '@/components/Select';
import {useSettings} from '@/dashboard';
import styles from '../../SettingsPanel.module.scss';

export function SearchEnginesSettingsSection() {
    const {
        settings,
        setActiveSearchEngineId,
        addCustomSearchEngine,
        removeCustomSearchEngine,
    } = useSettings();

    const locale = settings.locale;
    const [engineName, setEngineName] = useState('');
    const [engineUrl, setEngineUrl] = useState('');
    const searchOptions = getSearchEngineOptions(settings.customSearchEngines);

    const searchEngineSelectOptions = useMemo(
        () => searchOptions.map(option => ({value: option.id, label: option.name})),
        [searchOptions],
    );

    const addEngine = async () => {
        await addCustomSearchEngine({name: engineName, urlTemplate: engineUrl});
        setEngineName('');
        setEngineUrl('');
    };

    return (
        <section className={styles.section}>
            <h3>{t(locale, 'searchEngines')}</h3>
            <div className={styles.field}>
                <span>{t(locale, 'currentSearchEngines')}</span>
                <Select
                    value={settings.activeSearchEngineId}
                    options={searchEngineSelectOptions}
                    onChange={value => void setActiveSearchEngineId(value)}
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
                <small className={styles.hint}>
                    {t(locale, 'customSearchFormat')} <code>{SEARCH_URL_HINT}</code>
                </small>
                <button type="button" className="primary" onClick={() => void addEngine()}>
                    {t(locale, 'addSearchEngine')}
                </button>
            </div>

            {settings.customSearchEngines.length > 0 ? (
                <ul className={styles.engineList}>
                    {settings.customSearchEngines.map(engine => (
                        <li key={engine.id}>
                            <span>
                                {engine.name}: {engine.urlTemplate}
                            </span>
                            <button
                                type="button"
                                className={styles.dangerButton}
                                onClick={() => void removeCustomSearchEngine(engine.id)}
                            >
                                {t(locale, 'remove')}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </section>
    );
}
