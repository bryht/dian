export enum Filter {
    pdf = 'pdf',
    txt = 'txt',
    csv = 'csv',
}

export class File {
    static async openFile(title: string, defaultPath: string, filter: Filter) {
        const { ipcRenderer } = window.require('electron');
        const fileName = await ipcRenderer.invoke('show-save-dialog', {
            title,
            defaultPath,
            filter
        });
        if (fileName === undefined) {
            return false;
        }
        return fileName;
    }
}
