/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { Language, languages } from 'application/Models/Language';
import { BasicState } from 'core/RootComponent/BasicState';
import { ReactComponent as SettingSvg } from 'assets/settings.svg';
import { ReactComponent as SearchSvg } from 'assets/search.svg';
import { translateWord, getCulture } from 'application/Translate';
import WordHtml from 'application/WordHtml/WordHtml';
import { SearchItem } from '../Models/SearchItem';
import './Search.scss';
import { RootState } from 'core/Store';
import { DictActions } from 'application/DictRedux';
import { loadWordsAsync } from 'application/Load';
import { AutoCompleteInput } from '@bryht/auto-complete-input';
import CloseButton from 'components/CloseButton/CloseButton';

const { ipcRenderer } = window.require('electron');

export interface ISearchProps extends BasicProps {
    searchItems: Array<SearchItem>;
    languages: Array<Language>;
}
export interface ISearchStates extends BasicState {
    inputValue: string;
    typedValue: string;
    currentLanguage: Language;
    wordUrl: string;
    options: Array<string>;

}

class Search extends RootComponent<ISearchProps, ISearchStates>  {

    wordHtmlRef: React.RefObject<WordHtml>;
    typeInputRef: React.RefObject<AutoCompleteInput>;
    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.wordHtmlRef = React.createRef<WordHtml>();
        this.typeInputRef = React.createRef<AutoCompleteInput>();
        this.state = {
            inputValue: '',
            typedValue: '',
            options: [],
            currentLanguage: languages[0],
            wordUrl: '',
        }
    }

    async componentDidMount() {
        await this.invokeDispatchAsync(DictActions.LoadSearchItems());
    }

    async translateWord(text: string | null = null) {
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
        this.setState({ inputValue: '', options: [] });
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

    onInputValueChanged(inputValue: string) {
        this.setState({ inputValue });
    }

    async onTypedValueChanged(typedValue: string) {
        const { currentLanguage } = this.state;
        let culture = await getCulture(typedValue) || currentLanguage.culture;

        const splits = ['/', '\\', ',', '-'];
        splits.forEach(split => {
            if (typedValue.includes(split)) {
                var cultures = this.props.languages.map(x => x.culture);
                var inputCulture = typedValue.split(split)[1];
                var findCulture = cultures.find(x => x === inputCulture);
                if (findCulture) {
                    typedValue = typedValue.split(split)[0];
                    culture = findCulture;
                }
            }
        });
        const options = await loadWordsAsync(culture, typedValue, 6);
        this.setState({
            options: options ?? [],
            typedValue: typedValue,
            inputValue: typedValue,
            currentLanguage: this.getCurrentLanguageByCulture(culture) ?? currentLanguage
        });

    }

    changeCurrentLanguage(language: Language) {
        this.setState({ currentLanguage: language })
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

    renderWord(text: string, culture: string, item: SearchItem) {
        if (culture === 'zh' && SearchItem.isPhrase(item.words)) {
            return text;
        } else {
            return text.split(' ').map(w => <span key={w} onClick={() => this.showWordDetail(culture, w)}>{w}&nbsp;</span>)
        }
    }

    public render() {
        const { searchItems, languages } = this.props;
        const { wordUrl, currentLanguage, inputValue, options } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top d-flex mb-1 flex-column w-100 bg-white">
                    <div className="input-group">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{currentLanguage.cultureName}</button>
                        <ul className="dropdown-menu">
                            {
                                languages.map(l => <li key={l.culture}><a className="dropdown-item" href="#" onClick={()=>this.changeCurrentLanguage(l)}>{l.cultureName}&nbsp;&nbsp;(/{l.culture})</a></li>)
                            }
                        </ul>
                        <AutoCompleteInput
                            id="word"
                            ref={this.typeInputRef}
                            options={options}
                            placeholder="Command/Ctrl+F"
                            onTypedValueChanged={value => this.onTypedValueChanged(value)}
                            onInputValueChanged={value => this.onInputValueChanged(value)}
                            onKeyDown={key => {
                                if (key === "Enter") {
                                    this.translateWord()
                                }
                                if (key === "Escape") { this.typeInputRef.current?.blur(); }
                            }}
                            inputValue={inputValue}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.translateWord()}>
                                <SearchSvg />
                            </button>
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.toggleSetting()} >
                                <SettingSvg />
                            </button>
                        </div>
                    </div>
                </div >

                <ul className="translate-list">
                    {
                        searchItems.map(item => (
                            <li key={SearchItem.getId(item.words)} className={`translate-list-item ${SearchItem.isPhrase(item.words) && 'bg-success is-phrase'}`}>
                                <CloseButton className="list-item-close" close={() => this.deleteWord(SearchItem.getId(item.words))}></CloseButton>
                                <div className="translate-list-item-words">
                                    {item.words.map(x =>
                                        <div key={`${x.culture}-${x.text}`} >
                                            <div className="word">{this.renderWord(x.text, x.culture, item)}</div>
                                            <span className="culture">{x.culture}</span>
                                        </div>)}
                                </div>
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
        searchItems: state.dict.searchItems ?? [],
        languages: state.dict.languages.filter(p => p.isUsed),
        ...mapRootStateToProps(state)
    }
}
export default connect(mapStateToProps)(Search);