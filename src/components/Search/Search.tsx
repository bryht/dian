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
import { translateWord, getCulture } from 'utils/Translate';
import WordHtml from 'components/SearchWord/WordHtml';

export interface ISearchProps extends BasicProps {
}
export interface ISearchStates extends BasicState {
    searchItems: Array<SearchItem>;
    searchSuggestions: Array<SuggestionWord>;
    inputValue: string;
    languages: Array<Language>;
    currentCulture: string;
    currentLanguage: Language;
    wordUrl: string;

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
            currentLanguage: languages[0],
            wordUrl: '',
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
        const { inputValue, languages, searchItems } = this.state;
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
        this.showWordDDetail(inputValue);
    }

    async onInputValueChanged(inputValue: string) {

        let culture = '';
        if (inputValue.includes(',')) {
            var cultures = languages.map(x => x.culture);
            var inputCulture = inputValue.split(',')[1];
            var findCulture = cultures.find(x => x === inputCulture);
            if (findCulture) {
                culture = findCulture;
                inputValue = inputValue.split(',')[0];
            }
        } else {
            culture = await getCulture(inputValue);
        }
        let currentLanguage = languages.find(x => x.culture === culture);
        if (currentLanguage) {
            this.setState({ inputValue, currentLanguage });
        } else {
            this.setState({ inputValue });
        }
    }

    showWordDDetail(value: string) {
        const { currentLanguage } = this.state;
        if (currentLanguage) {
            const url = WordHtml.getWordUrl(value, currentLanguage.detailLink);
            this.setState({ wordUrl: url })
        }
    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { languages, searchItems, wordUrl, currentLanguage } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top mt-2 d-flex flex-column w-100">
                    <div className="input-group">
                        <input type="text" id="word" className="form-control"
                            onChange={e => this.onInputValueChanged(e.currentTarget.value)}
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
                <div className="accordion" id="accordionWords">
                    {searchItems.map(item =>
                        <div className="accordion-item" key={`heading${SearchItem.getId(item.words)}`}>
                            <h2 className="accordion-header" id={`heading${SearchItem.getId(item.words)}`}>
                                <button className="accordion-button collapsed flex-wrap" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${SearchItem.getId(item.words)}`} aria-expanded="false" aria-controls={`collapse${SearchItem.getId(item.words)}`}>
                                    {item.words.map(x =>
                                        <div className="mx-1 p-1 border border-secondary rounded">
                                            <div className="badge rounded-pill bg-info text-muted">{x.culture}</div>
                                            <span className="mx-1" onClick={() => this.showWordDDetail(x.text)}>{x.text}</span>
                                        </div>)}
                                </button>
                            </h2>
                            <div id={`collapse${SearchItem.getId(item.words)}`} className="accordion-collapse collapse" aria-labelledby={`heading${SearchItem.getId(item.words)}`} data-bs-parent="#accordionWords">
                                <div className="accordion-body overflow-hidden">
                                    <WordHtml url={wordUrl} hideTop={currentLanguage.detailHideTop} html="" />
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