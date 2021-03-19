import React, { Component } from 'react';
import { ReactComponent as CloseSvg } from 'assets/close.svg';
import './CloseButton.scss';
class CloseButton extends Component<{ className?: string, close: () => void }> {
    render() {
        return (
            <div className={`dict-close-button ${this.props.className}`} onClick={() => this.props.close()}>
                <CloseSvg />
            </div>
        );
    }
}

export default CloseButton;