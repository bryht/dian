import * as React from 'react';
import * as https from 'https';
import * as cheerio from 'cheerio';
import ReactModal from 'react-modal';
import './WordHtml.scss';
import CloseButton from 'components/CloseButton/CloseButton';

export interface IWordHtmlProps {
    url: string;
    hideTop: number;
}

export default class WordHtml extends React.Component<IWordHtmlProps, { isOpen: boolean }> {
    constructor(params: Readonly<IWordHtmlProps>) {
        super(params);
        this.state = {
            isOpen: false,
        }
    }

    public static getWordUrl(word: string, wordUrlTemplate: string) {
        return wordUrlTemplate.replace('{{word}}', word);
    }

    public static async getWordHtml(wordUrl: string) {

        return new Promise<string>((resolve, reject) => {

            const req = https.request(wordUrl, function (res) {
                const chunks: Buffer[] = [];
                res.on('data', function (chunk) {
                    chunks.push(chunk as Buffer);
                });
                res.on('end', function () {
                    const body = Buffer.concat(chunks);
                    const $body = cheerio.load(body.toString());
                    const html = $body.html();
                    debugger;
                    resolve(html);
                });
            });
            req.end();
        });

    }

    open() {
        this.setState({ isOpen: true });
    }
    close() {
        this.setState({ isOpen: false });
    }

    public render() {
        const { isOpen } = this.state;
        if (this.props.url) {
            return (<ReactModal
                onRequestClose={() => this.close()}
                shouldCloseOnEsc={true}
                shouldFocusAfterRender={true}
                shouldCloseOnOverlayClick={true}
                className="word-html-modal"
                style={{ overlay: { zIndex: 2000 } }}
                isOpen={isOpen}
            >
                <div className="d-flex flex-column">
                    <CloseButton className="align-self-end" close={() => this.close()}></CloseButton>
                    <webview id="webview" style={{ height: "90vh" }} useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1" src={this.props.url} />
                </div>
            </ReactModal>)
        }
        else
            return '';
    }
}
