import {t} from '@/app';
import {useSearchHistory, useSettings} from '@/dashboard';
import styles from '../../SettingsPanel.module.scss';
import {AddSearchEngineControls, SearchHistoryControls} from './components';

export function SearchEnginesSettingsSection() {
    const {
        settings,
        setActiveSearchEngineId,
        setSearchHistoryEnabled,
        addCustomSearchEngine,
        removeCustomSearchEngine,
    } = useSettings();

    const {searchHistory, deleteSearchHistoryEntries, clearSearchHistory} = useSearchHistory();

    const locale = settings.locale;

    return (
        <section className={styles.section}>
            <h3>{t(locale, 'searchEngines')}</h3>
            <AddSearchEngineControls
                locale={locale}
                settings={settings}
                onSelectActiveEngine={setActiveSearchEngineId}
                onAddCustomEngine={addCustomSearchEngine}
                onRemoveCustomEngine={removeCustomSearchEngine}
            />
            <SearchHistoryControls
                locale={locale}
                searchHistoryEnabled={settings.searchHistoryEnabled}
                searchHistory={searchHistory}
                onToggleSearchHistoryEnabled={setSearchHistoryEnabled}
                onClearSearchHistory={clearSearchHistory}
                onDeleteSearchHistoryEntries={deleteSearchHistoryEntries}
            />
        </section>
    );
}
