const { remote } = window.require('electron');

export enum Filter {
    pdf = 'pdf',
    txt = 'txt',
    csv = 'csv',
}

export class File {
    static async openFile(title: string, defaultPath: string, filter: Filter) {
        var win = remote.getCurrentWindow();
        const result = await remote.dialog.showSaveDialog(win, {
            'title': title,
            'defaultPath': defaultPath + '-' + Date.now(),
            'filters': [{ 'name': filter, 'extensions': [filter] }],
            'buttonLabel': 'Save'
        });
        const fileName = result.filePath;
        if (fileName === undefined) {
            return false;
        }
        return fileName;
    }
}
