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
export interface ISearchWordProps extends BasicProps {
}

export interface ISearchWordStates extends BasicState {
  words: Array<Word>;
  wordsSuggestion: Array<SuggestionWord>;
  inputValue: string;

}

class SearchWord extends RootComponent<ISearchWordProps, ISearchWordStates> {
  wordService: WordService;

  constructor(params: Readonly<ISearchWordProps>) {
    super(params);
    this.wordService = new WordService();
    this.state = {
      inputValue: '',
      words: [],
      wordsSuggestion: []
    }

  }
  toggleSetting() {
    this.invokeDispatch(SystemActions.ToggleSetting());
  }

  async componentDidMount() {
    let words = await this.wordService.getAllWords();
    this.setState({ words: words });
  }

  searchWordChanged(e: HTMLInputElement) {
    var wordsSuggestion = suggestion.filter(p => p.indexOf(e.value) > -1 && e.value)
      .slice(0, 5)
      .map((p:string) =>({ word: p, isSelected: false }));

    this.setState({ inputValue: e.value, wordsSuggestion })
  }

  async searchWord() {
    const { words, inputValue } = this.state;
    Log.Info(inputValue);
    let word = await this.wordService.getLongmanWord(inputValue);
    if (word.soundUrl && configPara.default.playSound === 'true') {
      await this.wordService.playSound(word.soundUrl);
    }
    var exist=words.find(p=>p.word===word.word);
    if(exist)words.splice(words.indexOf(exist));
    words.unshift(word);
    await this.wordService.updateWords(words);
    this.setState({ wordsSuggestion: [], words, inputValue: '' });
    this.showWord(word.id);
  }

  showWord(id: string) {
    const { words } = this.state;
    var result = words.map(p => {
      p.isShow = p.id === id && p.hasContent;
      return p;
    })
    this.setState({ words: result });
  }

  deleteWord(id: string, card: HTMLElement | undefined | null) {
    const { words } = this.state;
    if (card) {
      card.classList.add("word-delete");
      card.addEventListener('animationend', async t => {
        var result = words.filter(p => p.id !== id);
        await this.wordService.updateWords(result);
        this.setState({ words: result });
      });
    }
  }


  public render() {
    return (
      <>
        <div className="input-group sticky-top mt-2">
          <input type="text" id="word" className="form-control" value={this.state.inputValue} onKeyDown={e => { if (e.keyCode === 13) { this.searchWord() } }} onChange={e => this.searchWordChanged(e.target)} placeholder="Command/Ctrl+F" />
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
                <li className="list-group-item">{item.word}</li>
              ))
            }
          </ul>
        </div>

        <div id="wordHistory" className="mt-2">
          {
            this.state.words.map(
              element => (
                <div className="card" key={element.id} id={'card' + element.id}>
                  <div className={"card-header alert alert-" + (element.isPhrase ? "success" : "primary")} role="tab" id={'heading' + element.id}>
                    <>{[element.word, (element.isPhrase ? <br key={element.id} /> : ':'), element.translation]}</>
                    <a className="badge badge-pill badge-danger float-right text-light ml-1" onClick={e => this.deleteWord(element.id, document.getElementById('card' + element.id))}>Delete</a>
                    {element.hasContent ?
                      (<a data-toggle="collapse" href={"#collapse" + element.id} aria-controls={"collapse" + element.id} aria-expanded="true" className="badge badge-info float-right ml-1" onClick={e => this.showWord(element.id)}>See more</a>)
                      : ""}
                    {element.sign ? (<a className="badge badge-pill badge-warning float-right ml-1">{element.sign}</a>) : ""}
                  </div>
                  <div id={"collapse" + element.id} className={"card-body collapse" + (element.isShow === true ? " show" : "")} aria-labelledby={'heading' + element.id} data-parent="#wordHistory">
                    <div className="card-body" style={{ overflow: 'hidden' }}>
                      {element.isShow ?
                        (<webview id={element.id} src={element.url} style={{ marginTop: '-100px', height: '600px', display: 'flex' }}></webview>) : ""}
                    </div>
                  </div>
                </div>
              )
            )
          }
        </div>
      </>
    );
  }
}

export default connect(mapRootStateToProps)(SearchWord);