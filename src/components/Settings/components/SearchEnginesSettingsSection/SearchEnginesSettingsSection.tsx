import {Search} from 'lucide-react';
import {useSearchHistory, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {SettingsColumn} from '../SettingsColumn/SettingsColumn';
import {SettingsSubsection} from '../SettingsSubsection/SettingsSubsection';
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
        <SettingsColumn title={t(locale, 'searchEngines')} icon={Search}>
            <SettingsSubsection title={t(locale, 'searchEnginesSetup')}>
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
            </SettingsSubsection>
            <SettingsSubsection title={t(locale, 'searchHistory')} showDivider>
                <SearchHistoryControls
                    dismissRequestId={dismissRequestId}
                    locale={locale}
                    searchHistoryEnabled={settings.searchHistoryEnabled}
                    searchHistory={searchHistory}
                    onToggleSearchHistoryEnabled={setSearchHistoryEnabled}
                    onClearSearchHistory={clearSearchHistory}
                    onDeleteSearchHistoryEntries={deleteSearchHistoryEntries}
                />
            </SettingsSubsection>
        </SettingsColumn>
    );
}
