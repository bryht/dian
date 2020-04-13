/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import settingImage from 'assets/settings.svg';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { SystemActions } from 'components/System/SystemActions';
import { connect } from 'react-redux';
import { WordService } from 'utils/WordService';
import Word from 'core/Models/Word';
import { BasicState } from 'core/RootComponent/BasicState';
import Log from 'utils/Log';
import { configPara } from 'utils/ConfigPara';
import suggestion from "./SearchWordSuggestions";
import './SearchWord.scss'
import SuggestionWord from 'core/Models/SuggestionWord';
import { RootState } from 'redux/Store';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
export interface ISearchWordProps extends BasicProps {
  historyDeletedFlag: string;
}

export interface ISearchWordStates extends BasicState {
  words: Array<Word>;
  wordsSuggestion: Array<SuggestionWord>;
  inputValue: string;
  historyDeletedFlag: string;
}

class SearchWord extends RootComponent<ISearchWordProps, ISearchWordStates> {
  wordService: WordService;
  inputTextBox: any;
  constructor(params: Readonly<ISearchWordProps>) {
    super(params);
    this.wordService = new WordService();
    this.inputTextBox = React.createRef();
    this.state = {
      inputValue: '',
      words: [],
      wordsSuggestion: [],
      historyDeletedFlag: this.props.historyDeletedFlag
    }

  }
  toggleSetting() {
    this.invokeDispatch(SystemActions.ToggleSetting());
  }

  async componentDidMount() {
    await this.refreshHistory();
  }

  async refreshHistory() {
    let words = await this.wordService.getAllWords();
    this.setState({ words: words, historyDeletedFlag: this.props.historyDeletedFlag });
  }

  searchWordChanged(e: HTMLInputElement) {
    var wordsSuggestion = suggestion.filter(p => p.indexOf(e.value) > -1 && e.value)
      .slice(0, 5)
      .map((p: string) => ({ word: p, isSelected: false }));
    this.setState({ inputValue: e.value, wordsSuggestion })
  }

  searchWordSelectChanged() {
    const { wordsSuggestion } = this.state;
    var selected = wordsSuggestion.filter(p => p.isSelected);
    var selectedIndex = 0;
    if (selected[0]) {
      selected[0].isSelected = false;
      selectedIndex = wordsSuggestion.indexOf(selected[0]);
      if (selectedIndex < wordsSuggestion.length - 1) {
        selectedIndex++;
      } else if (selectedIndex === wordsSuggestion.length - 1) {
        selectedIndex = 0;
      }
    }
    wordsSuggestion[selectedIndex].isSelected = true;

    this.setState({ inputValue: wordsSuggestion[selectedIndex].word, wordsSuggestion });
  }

  async searchWord() {
    const { words, inputValue } = this.state;
    Log.Info(inputValue);
    let word = await this.wordService.getLongmanWord(inputValue);
    if (word.soundUrl !== undefined && configPara.default.playSound === 'true') {
      await this.wordService.playSound(word.soundUrl);
    }
    var exist = words.find(p => p.word === word.word);
    if (exist) words.splice(words.indexOf(exist), 1);
    words.unshift(word);
    await this.wordService.updateWords(words);
    this.setState({ wordsSuggestion: [], words, inputValue: '' });
    this.showWord(word.id);
    this.inputTextBox.current.blur();
  }

  showWord(id: string) {
    const { words } = this.state;
    var result = words.map(p => {
      p.isShow = p.id === id && p.hasContent;
      return p;
    })
    this.setState({ words: result });
  }

  async deleteWord(id: string) {
    const { words } = this.state;
    var result = words.filter(p => p.id !== id);
    await this.wordService.updateWords(result);
    this.setState({ words: result });
  }

  componentDidUpdate() {
    if (this.props.historyDeletedFlag !== this.state.historyDeletedFlag) {
      this.refreshHistory();
    }
  }

  public render() {

    return (
      <>
        <div className="input-group sticky-top mt-2">
          <input type="text" id="word" ref={this.inputTextBox} className="form-control" value={this.state.inputValue}
            onKeyDown={e => { if (e.keyCode === 13) { this.searchWord() } if (e.keyCode === 40) { this.searchWordSelectChanged() } }}
            onKeyUp={e => { if (e.keyCode === 27) { e.currentTarget.blur() } }}
            onChange={e => this.searchWordChanged(e.target)} placeholder="Command/Ctrl+F" />
          <div className="input-group-append">
            <button className="btn btn-secondary" type="button" onClick={e => this.searchWord()} >Search</button>
            <button className="btn btn-secondary active" type="button" onClick={e => this.toggleSetting()} >
              <img src={settingImage} alt="Setting" />
            </button>
          </div>
        </div>

        <div>
          <ul id="suggestion" className="list-group">
            {
              this.state.wordsSuggestion.map(item => (
                <li className={"list-group-item " + (item.isSelected ? "active" : "")} key={item.word}>{item.word}</li>
              ))
            }
          </ul>
        </div>

        <div id="wordHistory" className="mt-2">
          <TransitionGroup>
            {
              this.state.words.map(
                element => (
                  <CSSTransition
                    key={element.id}
                    timeout={300}
                    classNames="word">
                    <div className="card" key={element.id} id={'card' + element.id} >
                      <div className={"card-header alert alert-" + (element.isPhrase ? "success" : "primary")} role="tab" id={'heading' + element.id}>
                        <>{[element.word, (element.isPhrase ? <br key={element.id} /> : ':'), element.translation]}</>
                        <a className="badge badge-pill badge-danger float-right text-light ml-1" onClick={e => this.deleteWord(element.id)}>Delete</a>
                        {element.hasContent ?
                          (<a data-toggle="collapse" href={"#collapse" + element.id} aria-controls={"collapse" + element.id} aria-expanded="true" className="badge badge-info float-right ml-1" onClick={e => this.showWord(element.id)}>See more</a>)
                          : ""}
                        {element.sign ? (<a className="badge badge-pill badge-warning float-right ml-1">{element.sign}</a>) : ""}
                      </div>
                      <div id={"collapse" + element.id} className={"card-body collapse" + (element.isShow === true ? " show" : "")} style={{ padding: '0' }} aria-labelledby={'heading' + element.id} data-parent="#wordHistory">
                        <div className="card-body" style={{ overflow: 'hidden', padding: '0', margin: '0' }}>
                          {element.isShow ?
                            (<div id="wordShowing" style={{ height: '500px', overflow: 'scroll' }} >
                              <div dangerouslySetInnerHTML={{ __html: element.html }} style={{ pointerEvents: 'none' }} />
                            </div>)
                            : ""}

                        </div>
                      </div>
                    </div>
                  </CSSTransition>
                )
              )
            }
          </TransitionGroup>
        </div>
      </>
    );
  }
}
export function mapStateToProps(state: RootState) {
  return {
    historyDeletedFlag: state.system.historyDeletedFlag,
    ...mapRootStateToProps(state)
  }
}
export default connect(mapStateToProps)(SearchWord);