export interface LocalStorageData {
    [key: string]: any;
}

export interface AuthData {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        [key: string]: any;
    };
    token: string;
    refreshToken?: string;
}

export interface LocalStorageConfig {
    prefix?: string;
    encryption?: boolean;
    compression?: boolean;
}

class LocalStorageManager {
    private prefix: string;

    constructor(config: LocalStorageConfig = {}) {
        this.prefix = config.prefix || 'le';
    }

    // Check if localStorage is available   
    private checkAvailability(): boolean {
        // Only check in browser environment
        if (typeof window === 'undefined') {
            return false;
        }
        
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    // Generate full key with prefix
    private getFullKey(key: string): string {
        return `${this.prefix}.${key}`;
    }

    // Set item in localStorage
    setItem<T>(key: string, value: T): boolean {
        if (!this.checkAvailability()) {
            console.warn('localStorage not available, cannot set item:', key);
            return false;
        }

        try {
            const fullKey = this.getFullKey(key);
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(fullKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Error setting localStorage item:', key, error);
            return false;
        }
    }

    // Get item from localStorage
    getItem<T>(key: string, defaultValue?: T): T | null {
        if (!this.checkAvailability()) {
            console.warn('localStorage not available, cannot get item:', key);
            return defaultValue || null;
        }

        try {
            const fullKey = this.getFullKey(key);
            const item = localStorage.getItem(fullKey);

            if (item === null) {
                return defaultValue || null;
            }

            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error getting localStorage item:', key, error);
            return defaultValue || null;
        }
    }

    // Remove item from localStorage
    removeItem(key: string): boolean {
        if (!this.checkAvailability()) {
            console.warn('localStorage not available, cannot remove item:', key);
            return false;
        }

        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Error removing localStorage item:', key, error);
            return false;
        }
    }

    // Check if item exists in localStorage
    hasItem(key: string): boolean {
        if (!this.checkAvailability()) {
            return false;
        }

        try {
            const fullKey = this.getFullKey(key);
            return localStorage.getItem(fullKey) !== null;
        } catch (error) {
            console.error('Error checking localStorage item:', key, error);
            return false;
        }
    }

    // Clear all items with prefix
    clear(): boolean {
        if (!this.checkAvailability()) {
            console.warn('localStorage not available, cannot clear items');
            return false;
        }

        try {
            const keysToRemove: string[] = [];

            // Find all keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.prefix}.`)) {
                    keysToRemove.push(key);
                }
            }

            // Remove all found keys
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage items:', error);
            return false;
        }
    }

    // Get all items with prefix
    getAllItems(): LocalStorageData {
        if (!this.checkAvailability()) {
            return {};
        }

        const items: LocalStorageData = {};

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.prefix}.`)) {
                    const shortKey = key.replace(`${this.prefix}.`, '');
                    const value = this.getItem(shortKey);
                    if (value !== null) {
                        items[shortKey] = value;
                    }
                }
            }
        } catch (error) {
            console.error('Error getting all localStorage items:', error);
        }

        return items;
    }

    // Auth-specific methods
    setAuth(authData: AuthData): boolean {
        return this.setItem('auth', authData);
    }

    getAuth(): AuthData | null {
        return this.getItem<AuthData>('auth');
    }

    removeAuth(): boolean {
        return this.removeItem('auth');
    }

    hasAuth(): boolean {
        return this.hasItem('auth');
    }

    // User-specific methods
    getUser(): AuthData['user'] | null {
        const auth = this.getAuth();
        return auth?.user || null;
    }

    getUserId(): string | null {
        const user = this.getUser();
        return user?.id || null;
    }

    getToken(): string | null {
        const auth = this.getAuth();
        return auth?.token || null;
    }

    // Utility methods
    getAvailability(): boolean {
        return this.checkAvailability();
    }

    getPrefix(): string {
        return this.prefix;
    }
}

// Export singleton instance
export const localStorageManager = new LocalStorageManager();

// Export convenience functions
export const setAuth = (authData: AuthData) => localStorageManager.setAuth(authData);
export const getAuth = () => localStorageManager.getAuth();
export const removeAuth = () => localStorageManager.removeAuth();
export const hasAuth = () => localStorageManager.hasAuth();
export const getUser = () => localStorageManager.getUser();
export const getUserId = () => localStorageManager.getUserId();
export const getToken = () => localStorageManager.getToken();

export default localStorageManager; 