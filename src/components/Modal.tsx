import * as React from 'react';
import ReactModal from 'react-modal';

export interface IModalProps {
    onModalClosed?: () => void;
    children?: React.ReactNode;
}

export interface IModalRef {
    openModal: () => void;
    closeModal: () => void;
}

const Modal = React.forwardRef<IModalRef, IModalProps>((props, ref) => {
    const [isModalOpened, setIsModalOpened] = React.useState(false);

    const closeModal = React.useCallback(() => {
        setIsModalOpened(false);
        if (props.onModalClosed) {
            props.onModalClosed();
        }
    }, [props]);

    const openModal = React.useCallback(() => {
        setIsModalOpened(true);
    }, []);

    React.useImperativeHandle(ref, () => ({
        openModal,
        closeModal
    }));

    return (
        <ReactModal
            style={{ overlay: { zIndex: 2000 } }}
            isOpen={isModalOpened}
        >
            <div className="m-2 d-flex flex-column">
                <button type="button" className="btn-close align-self-end" onClick={closeModal}></button>
                <div className="m-2">
                    {props.children}
                </div>
            </div>
        </ReactModal>
    );
});

Modal.displayName = 'Modal';

export default Modal;