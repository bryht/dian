import * as React from 'react';
import { Language, languages, SearchItem } from '../types';
import { get, set, Consts } from '../utils';

type ViewId = 'translate' | 'history' | 'export' | 'settings';

interface DictContextValue {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  searchItems: SearchItem[];
  languages: Language[];
  inputLang: string;
  setInputLang: (lang: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  updateSearchItems: (items: SearchItem[]) => Promise<void>;
  updateLanguages: (items: Language[]) => Promise<void>;
  loadSearchItems: () => Promise<void>;
  loadLanguages: () => Promise<void>;
}

const DictContext = React.createContext<DictContextValue | undefined>(undefined);

export const DictProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = React.useState<ViewId>('translate');
  const [searchItems, setSearchItems] = React.useState<SearchItem[]>([]);
  const [languageList, setLanguageList] = React.useState<Language[]>([]);
  const [inputLang, setInputLang] = React.useState('en');
  const [isDark, setIsDark] = React.useState(false);

  const toggleDark = React.useCallback(() => {
    setIsDark(prev => !prev);
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

  React.useEffect(() => {
    loadSearchItems();
    loadLanguages();
  }, [loadSearchItems, loadLanguages]);

  const value = React.useMemo(() => ({
    activeView,
    setActiveView,
    searchItems,
    languages: languageList,
    inputLang,
    setInputLang,
    isDark,
    toggleDark,
    updateSearchItems,
    updateLanguages,
    loadSearchItems,
    loadLanguages,
  }), [
    activeView,
    searchItems,
    languageList,
    inputLang,
    isDark,
    toggleDark,
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