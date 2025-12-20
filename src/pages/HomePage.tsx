import * as React from 'react';
import Config from '../features/config/Config';
import Search from '../features/search/Search';
import { DictProvider, useDict } from '../context';
import Mousetrap from 'mousetrap';
import './HomePage.scss';

const HomePage: React.FC = () => {
    return (
        <DictProvider>
            <HomePageContent />
        </DictProvider>
    );
};

const HomePageContent: React.FC = () => {
    const { isSettingOpened } = useDict();

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
                <Search />
            </div>
            <div id="sidebar" className="sidebar">
                <Config />
            </div>
        </div>
    );
};

export default HomePage;
