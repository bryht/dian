const storage = window.require('electron-json-storage');
const os = window.require('os');
storage.setDataPath(os.tmpdir());

function get<T>(key: string, item: T | null = null): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
        storage.get(key, function (error: any, data: any) {
            if (error) { reject(error); }
            if ((data && data.hasOwnProperty()) ||
                Array.isArray(data)) {
                resolve(data as T);
            } else {
                resolve(item);
            }
        });
    });
}

function set<T>(key: string, item: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        storage.set(key, item, (errorMsg: any) => {
            if (errorMsg) { throw errorMsg; }
            resolve()
        });
    });
}

function remove(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        storage.remove(key, (errorMsg: any) => {
            if (errorMsg) {
                reject(errorMsg);
            }
            resolve();
        });
    });
}

export {
    get,
    set,
    remove,
}