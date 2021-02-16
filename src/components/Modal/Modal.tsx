import * as React from 'react';
import ReactModal from 'react-modal';

export interface IModalProps {
    isModalOpened: boolean
}

export interface IModalState {
    isSettingModalOpened: boolean
}

class Modal extends React.Component<IModalProps, any>  {
    customStyles = {
        content: {
            
        }
    };
    
    openSetting = () => {
        this.setState({ isSettingModalOpened: true })
    }
    closeSetting = () => {
        this.setState({ isSettingModalOpened: false })

    }

    public render() {
        const { children, isModalOpened } = this.props;
        return (

            <ReactModal
                isOpen={isModalOpened}
                onRequestClose={this.closeSetting}
            >
                {children}
            </ReactModal>

        );
    }
}

export default Modal;