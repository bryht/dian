import * as React from 'react';
import settingImage from 'assets/settings.svg';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { SystemActions } from 'components/System/SystemActions';
import { connect } from 'react-redux';
import { WordService } from 'utils/WordService';
import Word from 'core/Models/Word';
import { BasicState } from 'core/RootComponent/BasicState';
export interface ISearchWordProps extends BasicProps {
}

export interface ISearchWordStates extends BasicState {
  words: Array<Word>;
  wordsSuggestion: Array<string>;
}

class SearchWord extends RootComponent<ISearchWordProps, ISearchWordStates> {

  constructor(params: Readonly<ISearchWordProps>) {
    super(params);
    this.state = {
      words: [],
      wordsSuggestion: []
    }
  }
  toggleSetting() {
    this.invokeDispatch(SystemActions.ToggleSetting());
  }

  async searchWord() {
    // const { words } = this.state;
    // const inputWord = value.trim();
    const wordService = new WordService();

    let words= await wordService.getAllWords();
    words.forEach(element => {
      console.log(element.id);
    });
    // let word = await wordService.getLongmanWord(inputWord);
    // if (word.soundUrl && configPara.default.playSound === 'true') {
    //   wordService.playSound(word.soundUrl);
    // }
    // word = wordService.insertWord(word, words);
    // await wordService.updateWords(words);
    // if (word.isPhrase === false) {
    //   // document.querySelector('#web' + word.id).setAttribute('src', word.url);
    //   // document.getElementById('web' + word.id).setAttribute('src', word.url);
    //   const showList = document.querySelectorAll('.show');
    //   for (let index = 0; index < showList.length; index++) {
    //     const element = showList[index];
    //     element.classList.remove('show');
    //   }
    //   // document.querySelector('#collapse' + word.id).classList.add('show');
    //   // this.showWord(word.id, word.url);
    // }
    // event.target.blur();
    this.setState({ wordsSuggestion: [] });
  }

  public render() {
    return (
      <>
        <div className="input-group sticky-top mt-2">
          <input type="text" id="word" className="form-control" placeholder="Command/Ctrl+F" />
          <div className="input-group-append">
            <button className="btn btn-secondary" type="button" onClick={e=>this.searchWord()} >Search</button>
            <button className="btn btn-secondary active" type="button" onClick={e => this.toggleSetting()} >
              <img src={settingImage} alt="Setting" />
            </button>
          </div>
        </div>

        <div>
          <ul id="suggestion" className="list-group">
            <li className="list-group-item"></li>
          </ul>
        </div>

        <div id="wordHistory" className="mt-2">

          <div className="card" id="cardid">
            <div className="card-header alert alert-{{element.isPhrase ? 'success' : 'primary'}}" role="tab"
              id="heading{{element.id}}">
              {/* <a href="#" className="badge badge-pill badge-danger float-right text-light ml-1" >Delete</a>
              <a data-toggle="collapse" aria-expanded="false" className="visible badge badge-info float-right ml-1">See more</a>
              <a className="visible badge badge-pill badge-warning float-right ml-1">aaa</a> */}
            </div>
            <div id="collapse{{element.id}}" className="collapse card-body" style={{ overflow: 'hidden' }}
              aria-labelledby="heading{{element.id}}" data-parent="#wordHistory">

            </div>
          </div >
        </div >
      </>
    );
  }
}

export default connect(mapRootStateToProps)(SearchWord);