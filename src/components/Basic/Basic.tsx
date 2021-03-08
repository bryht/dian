import * as React from 'react';
import './Basic.scss';
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
    isSettingOpened: state.system.isSettingOpened,
    ...mapRootStateToProps(state),
})
export default connect(mapStateToProps)(Basic)