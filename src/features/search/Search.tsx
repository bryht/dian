/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Language, languages, SearchItem } from '../../models';
import { ReactComponent as SettingSvg } from 'assets/settings.svg';
import { ReactComponent as SearchSvg } from 'assets/search.svg';
import { translateWord, getCulture } from '../../services';
import WordHtml, { getWordUrl } from '../../components/WordDisplay/WordHtml';
import './Search.scss';
import { loadWordsAsync } from '../../services';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import CloseButton from '../../components/CloseButton/CloseButton';
import type { IWordHtmlRef } from '../../components/WordDisplay/WordHtml';
import { useDict } from '../../context';

const Search: React.FC = () => {
    const { searchItems, languages: contextLanguages, updateSearchItems, loadSearchItems, toggleSetting } = useDict();
    const allLanguages = React.useMemo(() => contextLanguages.filter((p: Language) => p.isUsed), [contextLanguages]);

    const wordHtmlRef = React.useRef<IWordHtmlRef>(null);
    const typeInputRef = React.useRef<any>(null);

    const [inputValue, setInputValue] = React.useState('');
    const [typedValue, setTypedValue] = React.useState('');
    const [currentLanguage, setCurrentLanguage] = React.useState<Language>(languages[0]);
    const [wordUrl, setWordUrl] = React.useState('');
    const [options, setOptions] = React.useState<Array<string>>([]);

    React.useEffect(() => {
        loadSearchItems();
    }, [loadSearchItems]);

    const handleTranslateWord = React.useCallback(async (text: string | null = null) => {
        if (text == null) {
            text = inputValue;
        }
        if (!text) {
            return;
        }
        let searchItem = new SearchItem();
        //translate
        for (let index = 0; index < allLanguages.length; index++) {
            const element = allLanguages[index];
            if (element.culture === currentLanguage.culture) {
                searchItem.words.push({ culture: element.culture, text });
            } else {
                var value = await translateWord(currentLanguage.culture, element.culture, text);
                searchItem.words.push({ culture: element.culture, text: value.toLowerCase() })
            }
        }

        //play sound
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('play-audio', { culture: currentLanguage.culture, value: text })

        //replace the list - create a copy to avoid mutating Redux state
        const updatedSearchItems = [...searchItems];
        const itemIndex = updatedSearchItems.findIndex(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words));
        if (itemIndex > -1) {
            updatedSearchItems.splice(itemIndex, 1);
        }
        updatedSearchItems.unshift(searchItem);

        //save the word
        setInputValue('');
        setOptions([]);
        await updateSearchItems(updatedSearchItems);
    }, [inputValue, currentLanguage, allLanguages, searchItems, updateSearchItems]);

    const deleteWord = React.useCallback((id: string) => {
        const updatedSearchItems = [...searchItems];
        const itemIndex = updatedSearchItems.findIndex(x => SearchItem.getId(x.words) === id);
        if (itemIndex > -1) {
            updatedSearchItems.splice(itemIndex, 1);
        }
        updateSearchItems(updatedSearchItems);
    }, [searchItems, updateSearchItems]);

    const onInputValueChanged = React.useCallback((value: string) => {
        setInputValue(value);
    }, []);

    const onTypedValueChanged = React.useCallback(async (value: string) => {
        let detected = await getCulture(value);
        let culture = (detected && ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'zh'].includes(detected)) ? detected : currentLanguage.culture;

        const splits = ['/', '\\', ',', '-'];
        splits.forEach(split => {
            if (value.includes(split)) {
                var cultures = allLanguages.map(x => x.culture);
                var inputCulture = value.split(split)[1];
                var findCulture = cultures.find(x => x === inputCulture);
                if (findCulture) {
                    value = value.split(split)[0];
                    culture = findCulture;
                }
            }
        });
        const newOptions = await loadWordsAsync(culture, value, 6);
        const newLanguage = getCurrentLanguageByCulture(culture) ?? currentLanguage;
        setOptions(newOptions ?? []);
        setTypedValue(value);
        setInputValue(value);
        setCurrentLanguage(newLanguage);
    }, [currentLanguage, allLanguages]);

    const changeCurrentLanguage = React.useCallback((language: Language) => {
        setCurrentLanguage(language);
    }, []);

    const getCurrentLanguageByCulture = React.useCallback((culture: string | null | undefined) => {
        return allLanguages.find(x => x.culture === culture);
    }, [allLanguages]);

    const showWordDetail = React.useCallback((culture: string, value: string) => {
        let lang = getCurrentLanguageByCulture(culture);
        if (lang) {
            const url = getWordUrl(value, lang.detailLink);
            setWordUrl(url);
        }
        wordHtmlRef.current?.open();
    }, [getCurrentLanguageByCulture]);

    const renderWord = React.useCallback((text: string, culture: string, item: SearchItem) => {
        if (culture === 'zh' && SearchItem.isPhrase(item.words)) {
            return text;
        } else {
            return text.split(' ').map(w => <span key={w} onClick={() => showWordDetail(culture, w)}>{w}&nbsp;</span>)
        }
    }, [showWordDetail]);

    return (
        <div className="d-flex flex-column">
            <div className="sticky-top d-flex mb-1 flex-column w-100 bg-white">
                <div className="input-group">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{currentLanguage.cultureName}</button>
                    <ul className="dropdown-menu">
                        {
                            allLanguages.map(l => <li key={l.culture}><a className="dropdown-item" href="#" onClick={() => changeCurrentLanguage(l)}>{l.cultureName}&nbsp;&nbsp;(/{l.culture})</a></li>)
                        }
                    </ul>
                    <AutoCompleteInput
                        id="word"
                        ref={typeInputRef}
                        options={options}
                        placeholder="Command/Ctrl+F"
                        className="auto-complete"
                        inputClassName="auto-complete-input-class-name"
                        listClassName="auto-complete-list-class-name"
                        onTypedValueChanged={onTypedValueChanged}
                        onInputValueChanged={onInputValueChanged}
                        onKeyDown={(key: string) => {
                            if (key === "Enter") {
                                handleTranslateWord();
                            }
                            if (key === "Escape") { 
                                typeInputRef.current?.blur(); 
                            }
                        }}
                        inputValue={inputValue}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleTranslateWord()}>
                            <SearchSvg />
                        </button>
                        <button className="btn btn-outline-secondary" type="button" onClick={toggleSetting} >
                            <SettingSvg />
                        </button>
                    </div>
                </div>
            </div >

            <ul className="translate-list">
                {
                    searchItems.map(item => (
                        <li key={SearchItem.getId(item.words)} className={`translate-list-item ${SearchItem.isPhrase(item.words) && 'bg-success is-phrase'}`}>
                            <CloseButton className="list-item-close" close={() => deleteWord(SearchItem.getId(item.words))}></CloseButton>
                            <div className="translate-list-item-words">
                                {item.words.map(x =>
                                    <div key={`${x.culture}-${x.text}`} >
                                        <div className="word">{renderWord(x.text, x.culture, item)}</div>
                                        <span className="culture">{x.culture}</span>
                                    </div>)}
                            </div>
                        </li>))
                }
            </ul>
            <WordHtml ref={wordHtmlRef} url={wordUrl} hideTop={currentLanguage.detailHideTop} />
        </div >
    );
};

export default Search;