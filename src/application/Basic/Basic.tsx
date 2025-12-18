import * as React from 'react';
import './Basic.scss';
import { RootState } from 'core/Store';
import { useSelector } from 'react-redux';
import Mousetrap from 'mousetrap';

export interface IBasicProps {
    searching: any;
    setting: any;
}

const Basic: React.FC<IBasicProps> = ({ searching, setting }) => {
    const isSettingOpened = useSelector((state: RootState) => state.dict.isSettingOpened);

    React.useEffect(() => {
        const { ipcRenderer } = window.require('electron');

        const handleInputMessage = (event: any, message: any) => {
            if (message === "focus") {
                const word = document.querySelector('#word') as HTMLInputElement;
                if (word) {
                    word.focus();
                    word.value = '';
                }
            }
        };

        const miniMize = async () => {
            await ipcRenderer.invoke('minimize-window');
        };

        ipcRenderer.on('input-message', handleInputMessage);

        Mousetrap.bind('esc', () => {
            const webview = document.querySelector('#webview') as HTMLElement;
            if (!webview) {
                miniMize();
            }
        });

        Mousetrap.bind(['command+f', 'ctrl+f'], () => {
            const word = document.querySelector('#word') as HTMLInputElement;
            if (word) {
                word.focus();
                word.value = '';
            }
        });

        Mousetrap.bind('J', () => {
            window.scrollTo(window.scrollX, window.scrollY + 20);
        });

        Mousetrap.bind('K', () => {
            window.scrollTo(window.scrollX, window.scrollY - 20);
        });

        return () => {
            ipcRenderer.removeListener('input-message', handleInputMessage);
            Mousetrap.unbind(['esc', 'command+f', 'ctrl+f', 'J', 'K']);
        };
    }, []);

    return (
        <div className={isSettingOpened ? 'wrapper toggled' : 'wrapper'}>
            <div className="content">
                {searching}
            </div>
            <div id="sidebar" className="sidebar">
                {setting}
            </div>
        </div>
    );
};

export default Basic;