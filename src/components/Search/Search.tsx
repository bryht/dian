import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { Language, languages } from 'components/Models/Language';
import { BasicState } from 'core/RootComponent/BasicState';
import SuggestionWord from 'core/Models/SuggestionWord';
import { ReactComponent as SettingSvg } from 'assets/settings.svg';
import { translateWord, getCulture } from 'utils/Translate';
import WordHtml from 'components/WordHtml/WordHtml';
import { SearchItem } from '../Models/SearchItem';
import './Search.scss';
import { RootState } from 'redux/Store';
import { DictActions } from 'components/DictRedux';
import TypeInput from 'components/TypeInput/TypeInput';

const { ipcRenderer } = window.require('electron');

export interface ISearchProps extends BasicProps {
    searchItems: Array<SearchItem>;
    languages: Array<Language>;
}
export interface ISearchStates extends BasicState {
    searchSuggestions: Array<SuggestionWord>;
    inputValue: string;
    currentLanguage: Language;
    wordUrl: string;
}

class Search extends RootComponent<ISearchProps, ISearchStates>  {

    wordHtmlRef: React.RefObject<WordHtml>;
    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.wordHtmlRef = React.createRef<WordHtml>();
        this.state = {
            searchSuggestions: [],
            inputValue: '',
            currentLanguage: languages[0],
            wordUrl: '',
        }
    }

    async componentDidMount() {
        await this.invokeDispatchAsync(DictActions.LoadSearchItems());
    }

    async searchWord(text: string | null = null) {
        const { searchItems, languages } = this.props;
        const { inputValue, currentLanguage } = this.state;
        if (text == null) {
            text = inputValue;
        }
        if (!text) {
            return;
        }
        let searchItem = new SearchItem();
        //translate
        for (let index = 0; index < languages.length; index++) {
            const element = languages[index];
            if (element.culture === currentLanguage.culture) {
                searchItem.words.push({ culture: element.culture, text });
            } else {
                var value = await translateWord(currentLanguage.culture, element.culture, text);
                searchItem.words.push({ culture: element.culture, text: value.toLowerCase() })
            }
        }

        //play sound
        ipcRenderer.send('play-audio', { culture: currentLanguage.culture, value: text })

        //replace the list
        const itemIndex = searchItems.findIndex(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words));
        if (itemIndex > -1) {
            searchItems.splice(itemIndex, 1);
        }
        searchItems.unshift(searchItem);

        //save the word
        this.setState({ inputValue: '' });
        await this.invokeDispatchAsync(DictActions.UpdateSearchItem([...searchItems]));
    }

    deleteWord(id: string) {
        const { searchItems } = this.props;
        const itemIndex = searchItems.findIndex(x => SearchItem.getId(x.words) === id);
        if (itemIndex > -1) {
            searchItems.splice(itemIndex, 1);
        }
        this.invokeDispatchAsync(DictActions.UpdateSearchItem([...searchItems]));
    }

    onCultureChanged(culture: string) {
        const currentLanguage = this.getCurrentLanguageByCulture(culture);
        if (currentLanguage) {
            this.setState({ currentLanguage });
        }
    }

    async onInputValueChanged(inputValue: string) {
        const culture = await getCulture(inputValue);
        const currentLanguage = this.getCurrentLanguageByCulture(culture);
        if (currentLanguage) {
            this.setState({ inputValue, currentLanguage });
        } else {
            this.setState({ inputValue });
        }

    }

    getCurrentLanguageByCulture(culture: string | null | undefined) {
        const { languages } = this.props;
        let currentLanguage = languages.find(x => x.culture === culture);
        return currentLanguage;
    }

    showWordDetail(culture: string, value: string) {
        let currentLanguage = this.getCurrentLanguageByCulture(culture);
        if (currentLanguage) {
            const url = WordHtml.getWordUrl(value, currentLanguage.detailLink);
            this.setState({ wordUrl: url })
        }

        this.wordHtmlRef.current?.open();
    }

    toggleSetting() {
        this.invokeDispatchAsync(DictActions.ToggleSetting());
    }

    public render() {
        const { searchItems } = this.props;
        const { wordUrl, currentLanguage, inputValue } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top mt-2 d-flex flex-column w-100 bg-white">
                    <div className="input-group">
                        <span className="input-group-text">{currentLanguage.cultureName}</span>
                        {/* <input type="text" id="word" className="form-control"
                            placeholder="Command/Ctrl+F"
                            onKeyDown={e => { if (e.key === "Enter") { this.searchWord() } }}
                            onKeyUp={e => { if (e.key === "Escape") { e.currentTarget.blur() } }}
                            onChange={e => this.onInputValueChanged(e.currentTarget.value)}
                            value={this.state.inputValue}></input> */}
                        <TypeInput
                            placeholder="Command/Ctrl+F"
                            languages={this.props.languages}
                            culture={currentLanguage.culture}
                            onCultureChanged={culture=>this.onCultureChanged(culture)}
                            onKeyDown={key => {
                                if (key === "Enter") { 
                                    this.searchWord() 
                                }
                                // if (key === "Escape") { e.currentTarget.blur() }
                            }}
                            onChange={e => this.onInputValueChanged(e)}
                            value={inputValue}
                        ></TypeInput>
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
                            <li key={SearchItem.getId(item.words)} className={`list-group-item d-flex justify-content-between ${SearchItem.isPhrase(item.words) && 'bg-success'}`}>
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
            </div >
        );
    }
}

export function mapStateToProps(state: RootState) {
    return {
        searchItems: state.dict.searchItems,
        languages: state.dict.languages.filter(p => p.isUsed),
        ...mapRootStateToProps(state)
    }
}
export default connect(mapStateToProps)(Search);