import * as React from 'react';
import { Language, languages } from './Models/Language';
import { SearchItem } from './Models/SearchItem';
import { get, set } from 'core/Utils/Storage';
import Consts from './Const';

interface DictContextValue {
    isSettingOpened: boolean;
    searchItems: SearchItem[];
    languages: Language[];
    toggleSetting: () => void;
    updateSearchItems: (items: SearchItem[]) => Promise<void>;
    updateLanguages: (items: Language[]) => Promise<void>;
    loadSearchItems: () => Promise<void>;
    loadLanguages: () => Promise<void>;
}

const DictContext = React.createContext<DictContextValue | undefined>(undefined);

export const DictProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSettingOpened, setIsSettingOpened] = React.useState(false);
    const [searchItems, setSearchItems] = React.useState<SearchItem[]>([]);
    const [languageList, setLanguageList] = React.useState<Language[]>([]);

    const toggleSetting = React.useCallback(() => {
        setIsSettingOpened(prev => !prev);
    }, []);

    const loadSearchItems = React.useCallback(async () => {
        try {
            const items = await get<SearchItem[]>(Consts.searchItems, []);
            setSearchItems(items || []);
        } catch (error) {
            console.error('Failed to load search items:', error);
            setSearchItems([]);
        }
    }, []);

    const updateSearchItems = React.useCallback(async (items: SearchItem[]) => {
        try {
            await set(Consts.searchItems, items);
            setSearchItems(items);
        } catch (error) {
            console.error('Failed to update search items:', error);
        }
    }, []);

    const loadLanguages = React.useCallback(async () => {
        try {
            const items = await get<Language[]>(Consts.languages, []);
            const languageArray = items || [];
            setLanguageList((languageArray && languageArray.length > 0) ? languageArray : languages);
        } catch (error) {
            console.error('Failed to load languages:', error);
            setLanguageList(languages);
        }
    }, []);

    const updateLanguages = React.useCallback(async (items: Language[]) => {
        try {
            await set(Consts.languages, items);
            setLanguageList(items);
        } catch (error) {
            console.error('Failed to update languages:', error);
        }
    }, []);

    const value = React.useMemo(() => ({
        isSettingOpened,
        searchItems,
        languages: languageList,
        toggleSetting,
        updateSearchItems,
        updateLanguages,
        loadSearchItems,
        loadLanguages,
    }), [
        isSettingOpened,
        searchItems,
        languageList,
        toggleSetting,
        updateSearchItems,
        updateLanguages,
        loadSearchItems,
        loadLanguages,
    ]);

    return (
        <DictContext.Provider value={value}>
            {children}
        </DictContext.Provider>
    );
};

export const useDict = () => {
    const context = React.useContext(DictContext);
    if (context === undefined) {
        throw new Error('useDict must be used within a DictProvider');
    }
    return context;
};
