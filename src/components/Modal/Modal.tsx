import * as React from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';

export interface IModalState {
    isSettingModalOpened: boolean
}

class Modal extends React.Component<any, IModalState>  {
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            isSettingModalOpened: true
        }
    }

    closeModal = () => {
        this.setState({ isSettingModalOpened: false })
    }

    openModal = () => {
        this.setState({ isSettingModalOpened: true })
    }

    public render() {
        const { children } = this.props;
        const { isSettingModalOpened } = this.state;
        return (
            <ReactModal
                style={{ overlay: { zIndex: 2000 } }}
                isOpen={isSettingModalOpened}
            >
                <div className="modal-component">
                    <button type="button" onClick={this.closeModal} className="modal-close-button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div className="modal-component-body">
                        {children}
                    </div>
                </div>
            </ReactModal>

        );
    }
}

export default Modal;