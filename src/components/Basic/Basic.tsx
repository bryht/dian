import * as React from 'react';
import { mapRootStateToProps, RootComponent } from 'core/RootComponent/RootComponent';
import { RootState } from 'redux/Store';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import Log from 'utils/Log';
const { remote, shell}= window.require('electron');

export interface IBasicProps extends BasicProps {
    searching: any;
    setting: any;
    isSettingOpened?: boolean;

}

class Basic extends RootComponent<IBasicProps, any> {

    miniMize() {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }
    componentDidMount() {

        const word = document.querySelector('#word') as HTMLInputElement;
        word.focus();
        word.value = '';
        Mousetrap.bind('esc', () => { this.miniMize(); });

        Mousetrap.bind(['command+f', 'ctrl+f'], e => {
            const word = document.querySelector('#word') as HTMLInputElement;
            word.focus();
            word.value = '';
        })
        Mousetrap.bind('j', function () {
            const word = document.querySelector('#wordShowing') as HTMLDivElement;
            if (word) word.scrollTop += 20;
        });
        Mousetrap.bind('k', function () {
            const word = document.querySelector('#wordShowing') as HTMLDivElement;
            if (word) word.scrollTop -= 20;
        });

        Mousetrap.bind('J', function () {
            window.scrollTo(window.scrollX, window.scrollY + 20);
        });
        Mousetrap.bind('K', function () {
            window.scrollTo(window.scrollX, window.scrollY - 20);
        });
    }
    public render() {
        const { isSettingOpened } = this.props;
        return (
            <>
                <div id="infoAlert" className="alert alert-warning alert-dismissible d-none" role="alert">
                    <strong>Info!</strong>
                    <span id="messages">You have new update downloaded, do you want to update?</span>
                    <button type="button" className="btn-primary">Update</button>
                    <button type="button" className="btn-warning" data-dismiss="alert" aria-label="Close">
                        Later
                </button>
                </div>
                <div className="modal fade" id="settingModal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h2>Setting</h2>
                                <hr />
                                <div className="form-group">
                                    <label>Language you know:</label>
                                    <select className="form-control">
                                        <option >element.name</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Language you learn:</label>
                                    <select className="form-control">
                                        <option >element.name</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Auto play word Sound?</label>
                                    <select className="form-control">
                                        <option >element.name</option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-success m-1" data-dismiss="modal">Save</button>
                                    <button className="btn btn-danger m-1" data-dismiss="modal">Cancle</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={isSettingOpened ? 'wrapper toggled' : 'wrapper'}>
                    <div className="content">
                        {this.props.searching}
                    </div>
                    <div id="sidebar" className="sidebar">
                        {this.props.setting}
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isSettingOpened: state.system.isSettingOpened,
    ...mapRootStateToProps(state),
})
export default connect(mapStateToProps)(Basic)