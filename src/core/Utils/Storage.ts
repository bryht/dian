let storage: any = null;
let remote: any = null;
let isInitialized = false;

function initializeStorage() {
    if (!isInitialized) {
        try {
            // Wait a bit to ensure Electron is fully ready
            if (typeof window === 'undefined' || !window.require) {
                console.warn('Electron environment not ready yet');
                return;
            }
            
            if (!storage) {
                storage = window.require('electron-json-storage');
            }
            if (!remote) {
                remote = window.require('@electron/remote');
            }
            
            if (storage && remote && remote.app) {
                storage.setDataPath(remote.app.getPath('userData'));
                isInitialized = true;
            }
        } catch (error) {
            console.error('Failed to initialize storage:', error);
        }
    }
}

function get<T>(key: string, item: T | null = null): Promise<T | null> {
    initializeStorage();
    return new Promise<T | null>((resolve, reject) => {
        if (!storage || !isInitialized) {
            console.warn('Storage not initialized, returning default value');
            resolve(item);
            return;
        }
        storage.get(key, function (error: any, data: any) {
            if (error) { reject(error); return; }
            // Check if data has any own properties or is an array
            if ((data && typeof data === 'object' && Object.keys(data).length > 0) ||
                Array.isArray(data)) {
                resolve(data as T);
            } else {
                resolve(item);
            }
        });
    });
}

function set<T>(key: string, item: T): Promise<void> {
    initializeStorage();
    return new Promise<void>((resolve, reject) => {
        if (!storage || !isInitialized) {
            console.warn('Storage not initialized, skipping save');
            resolve();
            return;
        }
        storage.set(key, item, (errorMsg: any) => {
            if (errorMsg) { throw errorMsg; }
            resolve()
        });
    });
}

export {
    get,
    set,
}