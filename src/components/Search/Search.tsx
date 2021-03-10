import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { Language, languages } from 'core/Models/Language';
import { get, set } from 'utils/Storage';
import { BasicState } from 'core/RootComponent/BasicState';
import SuggestionWord from 'core/Models/SuggestionWord';
import { SystemActions } from 'components/System/SystemActions';
import settingImage from 'assets/settings.svg';
import './Search.scss';
import { translateWord } from 'utils/Translate';
import WordHtml from 'components/SearchWord/WordHtml';

export interface ISearchProps extends BasicProps {
}
export interface ISearchStates extends BasicState {
    searchItems: Array<SearchItem>;
    searchSuggestions: Array<SuggestionWord>;
    inputValue: string;
    languages: Array<Language>;
    currentCulture: string;
    translateCulture: string;
    wordHtml: string;

}

class WordItem {
    culture: string = '';
    text: string = '';
}
class SearchItem {
    words: Array<WordItem> = [];
    data: number = Date.now();
    static getId = (items: Array<WordItem>): string => items.map(x => x.text).join('-');

}
class Search extends RootComponent<ISearchProps, ISearchStates>  {

    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.state = {
            searchItems: [],
            searchSuggestions: [],
            inputValue: '',
            languages: [],
            currentCulture: 'en',
            translateCulture: 'en',
            wordHtml: '',
        }
    }

    async componentDidMount() {
        const languagesItems = await get<Array<Language>>('languages', languages);
        const searchItems = await get<Array<SearchItem>>('searchItems');
        this.setState({
            languages: languagesItems ?? [],
            searchItems: searchItems?.sort((a, b) => a.data - b.data) ?? [],
        })
    }

    async searchWord(culture: string) {
        const { inputValue, languages, searchItems, translateCulture } = this.state;
        let searchItem = new SearchItem();
        for (let index = 0; index < languages.length; index++) {
            const element = languages[index];
            if (element.culture === culture) {

                searchItem.words.push({ culture: element.culture, text: inputValue });
            } else {
                var value = await translateWord(culture, element.culture, inputValue);
                searchItem.words.push({ culture: element.culture, text: value })
            }
        }

        const itemIndex = searchItems.findIndex(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words));
        if (itemIndex > 0) {
            searchItems.splice(itemIndex, 1);
        }
        searchItems.unshift(searchItem);
        this.setState({ searchItems });
        await set('searchItems', searchItems);
        await this.showWordDDetail(translateCulture, inputValue);
    }

    showWordDDetail(culture: string, value: string) {
        const { languages } = this.state;
        const currentLanguage = languages.find(x => x.culture === culture);
        if (currentLanguage) {
            const url = WordHtml.getWordUrl(value, currentLanguage.detailLink ?? '');
            this.setState({ wordHtml: url })
        }
    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { languages, searchItems, wordHtml } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top mt-2 d-flex flex-column w-100">
                    <div className="input-group">
                        <input type="text" id="word" className="form-control"
                            onChange={e => this.setState({ inputValue: e.currentTarget.value })}
                            value={this.state.inputValue}></input>
                        <div className="input-group-append">
                            <button className="btn btn-secondary active" type="button" onClick={e => this.toggleSetting()} >
                                <img src={settingImage} alt="Setting" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-d align-self-end mt-1">
                        {
                            languages.map(item => (<button type="button"
                                onClick={e => this.searchWord(item.culture)}
                                className="btn btn-outline-info btn-sm search-button">
                                {item.cultureName}
                            </button>))
                        }
                    </div>
                </div >
                <div className="accordion" id="accordionExample">
                    {searchItems.map(item =>
                        <div className="accordion-item" key={`heading${SearchItem.getId(item.words)}`}>
                            <h2 className="accordion-header" id={`heading${SearchItem.getId(item.words)}`}>
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${SearchItem.getId(item.words)}`} aria-expanded="false" aria-controls={`collapse${SearchItem.getId(item.words)}`}>
                                    {item.words.map(x =>
                                        <div className="mx-1 p-1 border border-secondary rounded">
                                            <div className="badge rounded-pill bg-info text-muted">{x.culture}</div>
                                            <span className="mx-1" onClick={() => this.showWordDDetail(x.culture, x.text)}>{x.text}</span>
                                        </div>)}
                                </button>
                            </h2>
                            <div id={`collapse${SearchItem.getId(item.words)}`} className="accordion-collapse collapse" aria-labelledby={`heading${SearchItem.getId(item.words)}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <WordHtml url={wordHtml} html="" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Search);