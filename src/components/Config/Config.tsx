import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Modal from 'components/Modal/Modal';

export interface IConfigProps extends BasicProps {
}

class Config extends RootComponent<IConfigProps, any>  {

    modalRef: React.RefObject<Modal>;
    constructor(props: Readonly<IConfigProps>) {
        super(props);
        this.modalRef = React.createRef<Modal>();
    }

    openSetting = () => {
        this.modalRef.current?.openModal();
    }

    openLink = () => {

    }

    public render() {
        return (
            <div className="btn-group-vertical">
                <button type="button" className="btn btn-secondary" onClick={this.openSetting}>
                    Setting
                </button>
                <button type="button" className="btn btn-warning" onClick={this.openLink}>
                    How To Use
                </button >
                <Modal ref={this.modalRef}>
                    <h2>fffffff</h2>
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