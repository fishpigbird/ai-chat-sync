import { Storage } from '@plasmohq/storage';

class AiChatSettingStorage {
    private static instance: AiChatSettingStorage;
    storage: Storage;
    syncInputAiChatStorageKey = "syncInputAiChats";
    quickOpenAiChatStorageKey = "quickOpenAiChats";
    quickOpenMethodStorageKey = "quickOpenMethod";

    static getInstance() {
        if (!AiChatSettingStorage.instance) {
            AiChatSettingStorage.instance = new AiChatSettingStorage();
        }
        return AiChatSettingStorage.instance;
    }

    private constructor() {
        this.storage = new Storage();
    }

    async getSyncInputAiChat(): Promise<string[]> {
        return await this.storage.get<string[]>(this.syncInputAiChatStorageKey) ?? [];
    }

    async addSyncInputAiChat(aiChatId: string) {
        let syncInputAiChats = await this.storage.get<string[]>(this.syncInputAiChatStorageKey) ?? [];
        if (!syncInputAiChats.includes(aiChatId)) {
            syncInputAiChats.push(aiChatId);
            await this.storage.set(this.syncInputAiChatStorageKey, syncInputAiChats);
        }
    }

    async removeSyncInputAiChat(aiChatId: string) {
        let syncInputAiChats = await this.storage.get<string[]>(this.syncInputAiChatStorageKey) ?? [];
        if (syncInputAiChats.includes(aiChatId)) {
            syncInputAiChats = syncInputAiChats.filter(id => id !== aiChatId);
            await this.storage.set(this.syncInputAiChatStorageKey, syncInputAiChats);
        }
    }

    async getQuickOpenAiChat(): Promise<string[]> {
        return await this.storage.get<string[]>(this.quickOpenAiChatStorageKey) ?? [];
    }

    async addQuickOpenAiChat(aiChatId: string) {
        let quickOpenAiChats = await this.storage.get<string[]>(this.quickOpenAiChatStorageKey) ?? [];
        if (!quickOpenAiChats.includes(aiChatId)) {
            quickOpenAiChats.push(aiChatId);
            await this.storage.set(this.quickOpenAiChatStorageKey, quickOpenAiChats);
        }
    }

    async removeQuickOpenAiChat(aiChatId: string) {
        let quickOpenAiChats = await this.storage.get<string[]>(this.quickOpenAiChatStorageKey) ?? [];
        if (quickOpenAiChats.includes(aiChatId)) {
            quickOpenAiChats = quickOpenAiChats.filter(id => id !== aiChatId);
            await this.storage.set(this.quickOpenAiChatStorageKey, quickOpenAiChats);
        }
    }

    async setQuickOpenMethod(quickOpenMethod: 'tab' | 'newWindowTab' | 'windowHorizontal' | 'windowVertical' | 'windowGrid') {
        await this.storage.set(this.quickOpenMethodStorageKey, quickOpenMethod);
    }

    async getQuickOpenMethod(): Promise<string> {
        return await this.storage.get<string>(this.quickOpenMethodStorageKey) ?? "tab";
    }
}

export default AiChatSettingStorage;
