import * as React from 'react';
import { mapRootStateToProps, RootComponent } from 'core/RootComponent/RootComponent';
import { RootState } from 'redux/Store';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import Log from 'utils/Log';
import { configPara, getConfig, setConfig } from 'utils/ConfigPara';
import { BasicState } from 'core/RootComponent/BasicState';
const { remote } = window.require('electron');

export interface IBasicProps extends BasicProps {
    searching: any;
    setting: any;
    isSettingOpened?: boolean;
    historyDeleted: () => void;


}
export interface IBasicStates extends BasicState {
    config: typeof configPara
}
class Basic extends RootComponent<IBasicProps, IBasicStates> {
    constructor(props: Readonly<IBasicProps>) {
        super(props);
        this.state = {
            config: configPara
        }
    }


    async componentDidMount() {
        
        var config = await getConfig()
        Log.Info(config);
        this.setState({ config })

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
    miniMize() {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }
    async settingSave(type: string, value: string) {
        Log.Info(this.state.config.default);
        switch (type) {
            case 'source':
                this.state.config.default.source = value;
                break;
            case 'playSound':
                this.state.config.default.playSound = value;
                break;
            default:
                break;
        }
        this.setState({ config: this.state.config });
        await setConfig(this.state.config.default);
    }
    public render() {
        const { isSettingOpened } = this.props;
        return (
            <>
                <div className="modal fade" id="settingModal" role="dialog" aria-hidden="true" style={{ background: 'transparent' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h2>Setting</h2>
                                <hr />
                                <div className="form-group">
                                    <label>Language you know:</label>
                                    <select className="form-control" value={this.state.config.default.source} onChange={e => { this.settingSave('source', e.target.value) }}>
                                        {
                                            this.state.config.languageSource.map(item => (<option value={item.value}>{item.name}</option>))
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Auto play word Sound?</label>
                                    <select className="form-control" value={this.state.config.default.playSound} onChange={e => { this.settingSave('playSound', e.target.value) }}>
                                        {
                                            this.state.config.playSoundOptions.map(item => (<option value={item.value}>{item.name}</option>))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
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