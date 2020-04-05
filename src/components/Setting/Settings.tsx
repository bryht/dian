import * as React from 'react';

export interface ISettingsProps {
}

export default class Settings extends React.Component<ISettingsProps> {
  public render() {
    return (
      <>
        <div className="btn-group-vertical sticky-top">
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Delete
            </button>
            <div className="dropdown-menu">
              <button type="button" className="dropdown-item">
                All History
              </button>
            </div>
          </div>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Export
            </button>
            <div className="dropdown-menu">
              <button type="button" className="dropdown-item">
                MutiChoice Test
              </button>
              <button type="button" className="dropdown-item">
                Blank Test
              </button>
              <button type="button" className="dropdown-item">
                To Memrise
              </button>
              <button type="button" className="dropdown-item" >
                To Quizlet
              </button >
              <button type="button" className="dropdown-item" >
                To Momo
              </button >
            </div >
          </div >
        </div>
        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#settingModal">
          Setting
        </button>
        <button type="button" className="btn btn-warning" >
          How To Use
        </button >
      </>
    );
  }
}
