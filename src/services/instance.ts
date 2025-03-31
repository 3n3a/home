import PocketBase from 'pocketbase'

const { API_URL, API_USERNAME, API_PASSWORD } = import.meta.env;

let instanceSingleton: PocketBase|null = null;

/**
 * Returns an authenticated PocketBased SDK Instance
 * 
 * @returns PocketBase
 */
export function getPocketbaseInstance(): PocketBase {
    if (!instanceSingleton) {
        // init
        instanceSingleton = new PocketBase(API_URL);

        // authenticate instance
        instanceSingleton.collection('users').authWithPassword(API_USERNAME, API_PASSWORD);
    }

    return instanceSingleton;
}