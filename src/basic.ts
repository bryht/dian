import * as fs from 'fs-extra';
import * as readline from 'readline';
import { remote } from 'electron';
export class Basic {


    async exportWords() {
        let filename = await remote.dialog.showSaveDialog({
            'title': 'SaveWords',
            'defaultPath': 'wordlist-result',
            'filters': [{ 'name': 'txt', 'extensions': ['.txt'] }],
            'buttonLabel': 'SaveWords'
        }, filename => {
            return filename;
        })
    }


}