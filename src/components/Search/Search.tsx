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

export interface ISearchProps extends BasicProps {
}
export interface ISearchStates extends BasicState {
    searchItems: Array<SearchItem>;
    searchSuggestions: Array<SuggestionWord>;
    inputValue: string;
    languages: Array<Language>;
    currentCulture: string;
}

class WordItem {
    culture: string = '';
    text: string = '';
}
class SearchItem {
    words: Array<WordItem> = [];
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
            currentCulture: 'en-GB'
        }
    }

    async componentDidMount() {
        const languagesItems = await get<Array<Language>>('languages', languages);
        const searchItems = await get<Array<SearchItem>>('searchItems');
        this.setState({
            languages: languagesItems ?? [],
            searchItems: searchItems ?? [],
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
        if (!searchItems.find(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words))) {
            searchItems.push(searchItem);
        }
        this.setState({ searchItems });
        await set('searchItems', searchItems);
    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { languages, searchItems } = this.state;
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
                <div>
                    {searchItems.map(item =>
                        <div key={SearchItem.getId(item.words)} className="d-flex">{item.words.map(word =>
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <div className="badge bg-primary">{word.text}</div>
                            
                        )}
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Search);