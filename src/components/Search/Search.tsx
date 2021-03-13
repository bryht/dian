import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { Language, languages } from 'core/Models/Language';
import { get, set } from 'utils/Storage';
import { BasicState } from 'core/RootComponent/BasicState';
import SuggestionWord from 'core/Models/SuggestionWord';
import { SystemActions } from 'components/System/SystemActions';
import { ReactComponent as SettingSvg } from 'assets/settings.svg';
import { translateWord, getCulture } from 'utils/Translate';
import WordHtml from 'components/WordHtml/WordHtml';
import { SearchItem } from './SearchItem';
import './Search.scss';
const { ipcRenderer } = window.require('electron');

export interface ISearchProps extends BasicProps {
}
export interface ISearchStates extends BasicState {
    searchItems: Array<SearchItem>;
    searchSuggestions: Array<SuggestionWord>;
    inputValue: string;
    installedLanguages: Array<Language>;
    currentLanguage: Language;
    wordUrl: string;

}

class Search extends RootComponent<ISearchProps, ISearchStates>  {

    wordHtmlRef: React.RefObject<WordHtml>;

    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.wordHtmlRef = React.createRef<WordHtml>();
        this.state = {
            searchItems: [],
            searchSuggestions: [],
            inputValue: '',
            installedLanguages: [],
            currentLanguage: languages[0],
            wordUrl: '',
        }
    }

    async componentDidMount() {
        const languagesItems = await get<Array<Language>>('languages', languages);
        const searchItems = await get<Array<SearchItem>>('searchItems');
        this.setState({
            installedLanguages: languagesItems ?? [],
            searchItems: searchItems?.sort((a, b) => a.data - b.data) ?? [],
        })
    }

    async searchWord() {
        const { inputValue, installedLanguages, searchItems, currentLanguage } = this.state;
        let searchItem = new SearchItem();
        //translate
        for (let index = 0; index < installedLanguages.length; index++) {
            const element = installedLanguages[index];
            if (element.culture === currentLanguage.culture) {

                searchItem.words.push({ culture: element.culture, text: inputValue });
            } else {
                var value = await translateWord(currentLanguage.culture, element.culture, inputValue);
                searchItem.words.push({ culture: element.culture, text: value })
            }
        }

        //play sound
        ipcRenderer.send('play-audio', { culture: currentLanguage.culture, value: inputValue })

        //replace the list
        const itemIndex = searchItems.findIndex(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words));
        if (itemIndex > 0) {
            searchItems.splice(itemIndex, 1);
        }
        searchItems.unshift(searchItem);

        //save the word
        this.setState({ searchItems, inputValue: '' });
        await set('searchItems', searchItems);
    }

    async deleteWord(id: string) {
        const { searchItems } = this.state;
        const itemIndex = searchItems.findIndex(x => SearchItem.getId(x.words) === id);
        if (itemIndex > -1) {
            searchItems.splice(itemIndex, 1);
        }
        this.setState({ searchItems });
        await set('searchItems', searchItems);
    }

    async onInputValueChanged(inputValue: string) {
        const { installedLanguages } = this.state;
        let culture;
        if (inputValue.includes(',')) {
            var cultures = installedLanguages.map(x => x.culture);
            var inputCulture = inputValue.split(',')[1];
            var findCulture = cultures.find(x => x === inputCulture);
            if (findCulture) {
                inputValue = inputValue.split(',')[0];
                culture = findCulture;
            }
        } else {
            culture = await getCulture(inputValue);
        }

        let currentLanguage = this.getCurrentLanguageByCulture(culture);
        if (currentLanguage) {
            this.setState({ inputValue, currentLanguage });
        } else {
            this.setState({ inputValue });
        }

    }

    getCurrentLanguageByCulture(culture: string | null | undefined) {
        const { installedLanguages } = this.state;
        let currentLanguage = installedLanguages.find(x => x.culture === culture);
        return currentLanguage;
    }

    showWordDetail(culture: string, value: string) {
        const { installedLanguages: languages } = this.state;
        const language = languages.find(x => x.culture === culture);
        if (language) {
            const url = WordHtml.getWordUrl(value, language.detailLink);
            this.setState({ wordUrl: url })
        }

        this.wordHtmlRef.current?.open();
    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { searchItems, wordUrl, currentLanguage } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top mt-2 d-flex flex-column w-100 bg-white">
                    <div className="input-group">
                        <span className="input-group-text">{currentLanguage.cultureName}</span>
                        <input type="text" id="word" className="form-control"
                            placeholder="Command/Ctrl+F"
                            onKeyDown={e => { if (e.key === "Enter") { this.searchWord() } }}
                            onKeyUp={e => { if (e.key === "Escape") { e.currentTarget.blur() } }}
                            onChange={e => this.onInputValueChanged(e.currentTarget.value)}
                            value={this.state.inputValue}></input>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.searchWord()}>Search</button>
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.toggleSetting()} >
                                <SettingSvg />
                            </button>
                        </div>
                    </div>
                </div >

                <ul className="list-group list-group-flush">
                    {
                        searchItems.map(item => (
                            <li className={`list-group-item d-flex justify-content-between ${SearchItem.isPhrase(item.words) && 'bg-success'}`}>
                                {SearchItem.isPhrase(item.words) ?
                                    <ul className="list-group">
                                        {item.words.map(x =>
                                            <li className="list-group-item">
                                                <span className="fw-bold fs-6">{x.culture}</span>
                                                <span className="mx-1" >- {x.text}</span>
                                            </li>)}
                                    </ul> :
                                    <div className={`d-flex flex-wrap`}>
                                        {item.words.map(x =>
                                            <button onClick={() => this.showWordDetail(x.culture, x.text)} className="mx-1 btn btn-outline-secondary">
                                                <span className="fw-bold fs-6">{x.culture}</span>
                                                <span className="mx-1" >- {x.text}</span>
                                            </button>)}
                                    </div>
                                }

                                <button type="button" className="btn-close align-self-center" onClick={() => this.deleteWord(SearchItem.getId(item.words))}></button>
                            </li>))
                    }
                </ul>
                <WordHtml ref={this.wordHtmlRef} url={wordUrl} hideTop={currentLanguage.detailHideTop} />
            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Search);