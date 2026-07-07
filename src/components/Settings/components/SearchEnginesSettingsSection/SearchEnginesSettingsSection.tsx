import {Search} from 'lucide-react';
import {useSearchHistory, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import {AddSearchEngineControls, SearchHistoryControls} from './components';

interface SearchEnginesSettingsSectionProps {
  dismissRequestId?: number;
}

export function SearchEnginesSettingsSection({dismissRequestId = 0}: SearchEnginesSettingsSectionProps) {
    const {
        settings,
        setActiveSearchEngineId,
        setSearchOpenInNewTab,
        setOnlineSearchSuggestionsEnabled,
        setSearchHistoryEnabled,
        addCustomSearchEngine,
        removeCustomSearchEngine,
    } = useSettings();

    const {searchHistory, deleteSearchHistoryEntries, clearSearchHistory} = useSearchHistory();

    const locale = settings.locale;

    return (
        <section className={styles.section}>
            <SettingsSectionHeader title={t(locale, 'searchEngines')} icon={Search} />
            <AddSearchEngineControls
                dismissRequestId={dismissRequestId}
                locale={locale}
                settings={settings}
                onSelectActiveEngine={setActiveSearchEngineId}
                onToggleSearchOpenInNewTab={setSearchOpenInNewTab}
                onToggleOnlineSuggestionsEnabled={setOnlineSearchSuggestionsEnabled}
                onAddCustomEngine={addCustomSearchEngine}
                onRemoveCustomEngine={removeCustomSearchEngine}
            />
            <SearchHistoryControls
                dismissRequestId={dismissRequestId}
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
