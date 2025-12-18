let storage: any = null;
let remote: any = null;
let isInitialized = false;
let initializationAttempted = false;

function initializeStorage() {
    if (isInitialized) return true;
    
    // Only try once per call to avoid spamming console
    if (!initializationAttempted) {
        initializationAttempted = true;
        try {
            // Check if Electron environment is ready
            if (typeof window === 'undefined' || !window.require) {
                return false;
            }
            
            // Try to load modules with additional error handling
            if (!storage) {
                storage = window.require('electron-json-storage');
            }
            if (!remote) {
                remote = window.require('@electron/remote');
            }
            
            if (storage && remote && remote.app) {
                storage.setDataPath(remote.app.getPath('userData'));
                isInitialized = true;
                return true;
            }
        } catch (error) {
            // Silently fail - Electron not ready yet
            initializationAttempted = false; // Allow retry
            return false;
        }
    }
    
    return isInitialized;
}

function get<T>(key: string, item: T | null = null): Promise<T | null> {
    // Try to initialize, but don't fail if not ready
    if (!initializeStorage()) {
        // Storage not ready, return default immediately
        return Promise.resolve(item);
    }
    
    return new Promise<T | null>((resolve, reject) => {
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
    // Try to initialize, but don't fail if not ready
    if (!initializeStorage()) {
        // Storage not ready, silently skip
        return Promise.resolve();
    }
    
    return new Promise<void>((resolve, reject) => {
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