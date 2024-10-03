import { Storage } from '@plasmohq/storage';

interface ActiveAiChat {
    tabId: number;
    aiChatId: string;
    aiChatName: string;
    aiChatIcon: string;
    syncInput: boolean;
    active: boolean;
}

class ActiveAiChatStorage {
    private static instance: ActiveAiChatStorage;
    storageKey: string = "activeAiChats";
    syncInputMainSwitchStorageKey = "syncInputMainSwitch";
    storage: Storage;

    static getInstance() {
        if (!ActiveAiChatStorage.instance) {
            ActiveAiChatStorage.instance = new ActiveAiChatStorage();
        }
        return ActiveAiChatStorage.instance;
    }

    private constructor() {
        this.storage = new Storage({area: "session" })
    }

    async getAiChats() {
        return await this.storage.get<ActiveAiChat[]>(this.storageKey) ?? [];
    }

    async getActiveAiChat() {
        const tabs = await this.getAiChats();
        return tabs.find(tab => tab.active);
    }

    async isAiChatSite(tabId: number) {
        const tabs = await this.getAiChats();
        return tabs.some(tab => tab.tabId === tabId);
    }

    async registerAiChat(activeAiChat: ActiveAiChat) {
        let tabs = await this.storage.get<ActiveAiChat[]>(this.storageKey) ?? [];
        if (!tabs.find(tab => tab.tabId === activeAiChat.tabId)) {
            tabs.push(activeAiChat);
            await this.storage.set(this.storageKey, tabs);
        }
    }

    async unregisterAiChat(tabId: number) {
        let tabs = await this.storage.get<ActiveAiChat[]>(this.storageKey) ?? [];
        if (tabs.find(tab => tab.tabId === tabId)) {
            tabs = tabs.filter(tab => tab.tabId !== tabId);
            await this.storage.set(this.storageKey, tabs);
        }
    }

    async unregisterAllAiChat() {
        await this.storage.set(this.storageKey, []);
    }

    async activeAiChat(tabId: number) {
        let tabs = await this.storage.get<ActiveAiChat[]>(this.storageKey) ?? [];
        tabs = tabs.map(tab => {
            tab.active = tab.tabId === tabId;
            return tab;
        });
        await this.storage.set(this.storageKey, tabs);
    }

    async setAiChatSyncInput(tabId: number, syncInput: boolean) {
        let tabs = await this.storage.get<ActiveAiChat[]>(this.storageKey) ?? [];
        tabs = tabs.map(tab => {
            if (tab.tabId === tabId) {
                tab.syncInput = syncInput;
            }
            return tab;
        });
        await this.storage.set(this.storageKey, tabs);
    }

    async getSyncInputMainSwitch(): Promise<boolean> {
        return await this.storage.get<boolean>(this.syncInputMainSwitchStorageKey) ?? true;
    }

    async setSyncInputMainSwitch(syncInputMainSwitch: boolean) {
        await this.storage.set(this.syncInputMainSwitchStorageKey, syncInputMainSwitch);
    }
}

export default ActiveAiChatStorage;
export { type ActiveAiChat };
