import { remote } from 'electron';
export enum Filter {
    pdf = 'pdf',
    txt = 'txt'
}
export class File {
    constructor(parameters) {
    }
    static async openFile(title: string, defaultPath: string, filter: Filter) {
        const fileName = await new Promise<string>(resolve => {
            remote.dialog.showSaveDialog({
                'title': title,
                'defaultPath': defaultPath + '-' + Date.now(),
                'filters': [{ 'name': filter, 'extensions': [filter] }],
                'buttonLabel': 'Save'
            }, result => {
                resolve(result);
            });
        });
        if (fileName === undefined) {
            return false;
        }
        return fileName;
    }
}