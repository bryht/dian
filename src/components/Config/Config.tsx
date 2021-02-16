import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Modal from 'components/Modal/Modal';

export interface IConfigProps extends BasicProps {
}

class Config extends RootComponent<IConfigProps, any>  {

    constructor(props: Readonly<IConfigProps>) {
        super(props);
        this.state = {
            isSettingModalOpened: false
        }
    }
    openSetting = () => {
        this.setState({ isSettingModalOpened: true })
    }
    closeSetting = () => {
        this.setState({ isSettingModalOpened: false })

    }
    openLink = () => {

    }

    public render() {
        const { isSettingModalOpened } = this.state;
        return (
            <div className="btn-group-vertical">
                <button type="button" className="btn btn-secondary" onClick={this.openSetting}>
                    Setting
                </button>
                <button type="button" className="btn btn-warning" onClick={this.openLink}>
                    How To Use
                </button >
                <Modal isModalOpened={isSettingModalOpened}>
                    <h2>fffffff</h2>
                    <button onClick={this.closeSetting}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Config);