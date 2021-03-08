import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { Language, languages } from 'core/Models/Language';
import { get } from 'utils/Storage';
import { BasicState } from 'core/RootComponent/BasicState';
import SuggestionWord from 'core/Models/SuggestionWord';
import Word from 'core/Models/Word';
import { SystemActions } from 'components/System/SystemActions';
import settingImage from 'assets/settings.svg';
import './Search.scss';
import { translateWord } from 'utils/Translate';

export interface ISearchProps extends BasicProps {
}
export interface ISearchStates extends BasicState {
    words: Array<Word>;
    wordsSuggestion: Array<SuggestionWord>;
    inputValue: string;
    languages: Array<Language>;
    currentCulture: string;
}
class Search extends RootComponent<ISearchProps, ISearchStates>  {

    constructor(props: Readonly<ISearchProps>) {
        super(props);
        this.state = {
            words: [],
            wordsSuggestion: [],
            inputValue: '',
            languages: [],
            currentCulture: 'en-GB'
        }
    }

    async componentDidMount() {
        const items = await get<Array<Language>>('languages', languages);
        this.setState({ languages: items ?? [] })
    }

    async searchWord(culture: string) {
        // const { inputValue } = this.state;

        // translateWord(culture,)


    }

    toggleSetting() {
        this.invokeDispatch(SystemActions.ToggleSetting());
    }

    public render() {
        const { languages } = this.state;
        return (
            <div className="d-flex">
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

            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Search);