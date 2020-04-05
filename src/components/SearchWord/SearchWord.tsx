import * as React from 'react';
import settingImage from 'assets/settings.svg';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { BasicState } from 'core/RootComponent/BasicState';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { SystemActions } from 'components/System/SystemActions';
import { connect } from 'react-redux';
export interface ISearchWordProps extends BasicProps {
}

class SearchWord extends RootComponent<ISearchWordProps, BasicState> {

  toggleSetting() {
    this.invokeDispatch(SystemActions.ToggleSetting());
  }

  public render() {
    return (
      <>
        <div className="input-group sticky-top mt-2">
          <input type="text" id="word" className="form-control" placeholder="Command/Ctrl+F" />
          <div className="input-group-append">
            <button className="btn btn-secondary" type="button" >Search</button>
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