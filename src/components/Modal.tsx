import * as React from 'react';
import ReactModal from 'react-modal';

export interface IModalState {
    isModalOpened: boolean
}

class Modal extends React.Component<any, IModalState>  {
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            isModalOpened: false
        }
    }

    closeModal = () => {
        this.setState({ isModalOpened: false })
        const { onModalClosed } = this.props;
        if (onModalClosed) {
            onModalClosed();
        }
    }

    openModal = () => {
        this.setState({ isModalOpened: true })
    }

    public render() {
        const { children } = this.props;
        const { isModalOpened } = this.state;
        return (
            <ReactModal
                style={{ overlay: { zIndex: 2000 } }}
                isOpen={isModalOpened}
            >
                <div className="m-2 d-flex flex-column">
                    <button type="button" className="btn-close align-self-end" onClick={this.closeModal}></button>
                    <div className="m-2">
                        {children}
                    </div>
                </div>
            </ReactModal>

        );
    }
}

export default Modal;