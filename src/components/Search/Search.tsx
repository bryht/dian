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
import Modal from 'components/Modal/Modal';

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

    modalRef: React.RefObject<Modal>;

    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.modalRef = React.createRef<Modal>();
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
        for (let index = 0; index < installedLanguages.length; index++) {
            const element = installedLanguages[index];
            if (element.culture === currentLanguage.culture) {

                searchItem.words.push({ culture: element.culture, text: inputValue });
            } else {
                var value = await translateWord(currentLanguage.culture, element.culture, inputValue);
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
        this.showWordDDetail(currentLanguage.culture, inputValue);
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

    showWordDDetail(culture: string, value: string) {
        const { installedLanguages: languages } = this.state;
        const language = languages.find(x => x.culture === culture);
        if (language) {
            const url = WordHtml.getWordUrl(value, language.detailLink);
            this.setState({ wordUrl: url })
        }

        this.modalRef.current?.openModal();
    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { searchItems, wordUrl, currentLanguage } = this.state;
        return (
            <div className="d-flex flex-column">
                <div className="sticky-top mt-2 d-flex flex-column w-100">
                    <div className="input-group">
                        <span className="input-group-text">{currentLanguage.culture}</span>
                        <input type="text" id="word" className="form-control"
                            onChange={e => this.onInputValueChanged(e.currentTarget.value)}
                            value={this.state.inputValue}></input>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.searchWord()}>Search</button>
                            <button className="btn btn-outline-secondary active" type="button" onClick={e => this.toggleSetting()} >
                                <img src={settingImage} alt="Setting" />
                            </button>
                        </div>
                    </div>
                </div >

                <ul className="list-group list-group-flush">
                    {
                        searchItems.map(item => (
                            <li className="list-group-item d-flex flex-wrap">
                                {item.words.map(x =>
                                    <button onClick={() => this.showWordDDetail(x.culture, x.text)} className="mx-1 btn btn-outline-secondary">
                                        <div className="badge rounded-pill bg-info text-muted">{x.culture}</div>
                                        <span className="mx-1" >{x.text}</span>
                                    </button>)}
                            </li>))
                    }
                </ul>
                <Modal ref={this.modalRef}>
                    <WordHtml url={wordUrl} hideTop={currentLanguage.detailHideTop} html="" />
                </Modal>
            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Search);