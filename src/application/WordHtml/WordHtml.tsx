import * as React from 'react';
import * as cheerio from 'cheerio';
import ReactModal from 'react-modal';
import './WordHtml.scss';
import CloseButton from 'components/CloseButton/CloseButton';

export interface IWordHtmlProps {
    url: string;
    hideTop: number;
}

export interface IWordHtmlRef {
    open: () => void;
    close: () => void;
}

const WordHtml = React.forwardRef<IWordHtmlRef, IWordHtmlProps>((props, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const open = React.useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = React.useCallback(() => {
        setIsOpen(false);
    }, []);

    React.useImperativeHandle(ref, () => ({
        open,
        close
    }));

    if (!props.url) {
        return null;
    }

    return (
        <ReactModal
            onRequestClose={close}
            shouldCloseOnEsc={true}
            shouldFocusAfterRender={true}
            shouldCloseOnOverlayClick={true}
            className="word-html-modal"
            style={{ overlay: { zIndex: 2000 } }}
            isOpen={isOpen}
        >
            <div className="d-flex flex-column">
                <CloseButton className="align-self-end" close={close}></CloseButton>
                <webview id="webview" style={{ height: "90vh" }} useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1" src={props.url} />
            </div>
        </ReactModal>
    );
});

WordHtml.displayName = 'WordHtml';

// Static helper methods
export const getWordUrl = (word: string, wordUrlTemplate: string): string => {
    return wordUrlTemplate.replace('{{word}}', word);
};

export const getWordHtml = async (wordUrl: string): Promise<string> => {
    try {
        const response = await fetch(wordUrl);
        const body = await response.text();
        const $body = cheerio.load(body);
        const html = $body.html();
        return html || '';
    } catch (error) {
        console.error('Error fetching word HTML:', error);
        return '';
    }
};

export default WordHtml;
