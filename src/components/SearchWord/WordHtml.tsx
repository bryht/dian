import * as React from 'react';
import * as https from 'https';
import * as cheerio from 'cheerio';

export interface IWordHtmlProps {
    html: string;
    url: string;
    hideTop: number;
}

export default class WordHtml extends React.Component<IWordHtmlProps, { html: string }> {
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

    public render() {
        if (this.props.html)
            return (<div dangerouslySetInnerHTML={{ __html: this.props.html }} style={{ pointerEvents: 'none' }} />);
        else if (this.props.url) {

            let webView = document.getElementById('webview');
            if (!webView) {
                return (<webview id="webview" style={{ height: 500, marginTop: -this.props.hideTop }} src={this.props.url} plugins />);
            } else {
                webView.setAttribute('src', this.props.url);
                return document.getElementById('webview');
            }
        }
        else
            return '';
    }
}
