import type { SendKey } from '@/ai/abstract-ai-chat';
import AiChatSettingStorage from '@/storage/ai-chat-setting-storage';
import { Storage } from '@plasmohq/storage';

export interface CustomAiChatSite {
    id?: string;
    name: string;
    icon: string;
    url: string;
    matches: string;
    chatInputRuleType: 'custom' | 'exist';
    chatInputRule?: string;
    inputSelector: string;
    sendButtonSelector: string;
    sendKeys: SendKey | null;
}

class CustomAiChatStorage {
    private static instance: CustomAiChatStorage;
    storage: Storage;
    storageKey = "customAiChatSites";

    static getInstance() {
        if (!CustomAiChatStorage.instance) {
            CustomAiChatStorage.instance = new CustomAiChatStorage();
        }
        return CustomAiChatStorage.instance;
    }

    private constructor() {
        this.storage = new Storage();
    }

    async getCustomAiChats(): Promise<CustomAiChatSite[]> {
        return await this.storage.get<CustomAiChatSite[]>(this.storageKey) ?? [];
    }

    async getCustomAiChatByUrl(url: string): Promise<CustomAiChatSite | null> {
        const customAiChatSites = await this.getCustomAiChats();
        return customAiChatSites.find(site => site.url === url);
    }

    // save custom ai chat site
    async saveCustomAiChat(customAiChatSite: CustomAiChatSite) {
        let customAiChatSites = await this.storage.get<CustomAiChatSite[]>(this.storageKey) ?? [];
        const find = customAiChatSites.find(site => site.url === customAiChatSite.url);
        if (!find) {
            customAiChatSite.id = Date.now().toString();
            customAiChatSites.push(customAiChatSite);
        }
        else {
            customAiChatSite.id = find.id;
            customAiChatSites = customAiChatSites.map(site => site.id === find.id ? {...find, ...customAiChatSite} : site);
        }
        await this.storage.set(this.storageKey, customAiChatSites);
        return customAiChatSite
    }

    // remove custom ai chat site by id
    async removeCustomAiChatById(id: string) {
        let customAiChatSites = await this.storage.get<CustomAiChatSite[]>(this.storageKey) ?? [];
        if (customAiChatSites.find(site => site.id === id)) {
            customAiChatSites = customAiChatSites.filter(site => site.id !== id)
            await this.storage.set(this.storageKey, customAiChatSites);

            const aiChatSettingStorage = AiChatSettingStorage.getInstance();
            await aiChatSettingStorage.removeSyncInputAiChat(id);
            await aiChatSettingStorage.removeQuickOpenAiChat(id);
        }
    }
}

export default CustomAiChatStorage;
