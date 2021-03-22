import * as React from 'react';
import './Basic.scss';
import { mapRootStateToProps, RootComponent } from 'core/RootComponent/RootComponent';
import { RootState } from 'core/Store';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import { BasicState } from 'core/RootComponent/BasicState';
const { remote,ipcRenderer } = window.require('electron');

export interface IBasicProps extends BasicProps {
    searching: any;
    setting: any;
    isSettingOpened?: boolean;

}
export interface IBasicStates extends BasicState {
}
class Basic extends RootComponent<IBasicProps, IBasicStates> {

    async componentDidMount() {

        ipcRenderer.on('input-message', (event:any, message:any) => {
            if (message==="focus") {
                const word = document.querySelector('#word') as HTMLInputElement;
                word.focus();
                word.value = '';
            }
          })
        Mousetrap.bind('esc', () => { 
            const webview=document.querySelector('#webview') as HTMLWebViewElement;
            if (webview==null) {
                this.miniMize();
            }
        });

        Mousetrap.bind(['command+f', 'ctrl+f'], e => {
            const word = document.querySelector('#word') as HTMLInputElement;
            word.focus();
            word.value = '';
        })

        Mousetrap.bind('J', function () {
            window.scrollTo(window.scrollX, window.scrollY + 20);
        });
        Mousetrap.bind('K', function () {
            window.scrollTo(window.scrollX, window.scrollY - 20);
        });

    }
    miniMize() {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }
    
    public render() {
        const { isSettingOpened } = this.props;
        return (
            <div className={isSettingOpened ? 'wrapper toggled' : 'wrapper'}>
                <div className="content">
                    {this.props.searching}
                </div>
                <div id="sidebar" className="sidebar">
                    {this.props.setting}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isSettingOpened: state.dict.isSettingOpened,
    ...mapRootStateToProps(state),
})
export default connect(mapStateToProps)(Basic)