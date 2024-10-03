import EventQueue from '@/common/event-queue';
import { isEmpty } from '@/common/functions';
import ActiveAiChatStorage from '@/storage/active-ai-chat-storage';
const activeAiChatStorage = ActiveAiChatStorage.getInstance();
const eventQueue = new EventQueue();

async function activeAiChatByTabId(tabId: number) {
    const isAiChatSite = await activeAiChatStorage.isAiChatSite(tabId);
    if (isAiChatSite) {
        const lastActiveAiChats = await activeAiChatStorage.getActiveAiChat();
        if (lastActiveAiChats) {
            await chrome.tabs.sendMessage(lastActiveAiChats.tabId, {type: 'aiChat.deactivate'});
        }
        await chrome.tabs.sendMessage(tabId, {type: 'aiChat.activate'});
        await activeAiChatStorage.activeAiChat(tabId);
    }
}

async function registerAiChat(message: Message, sender: chrome.runtime.MessageSender) {
    await activeAiChatStorage.registerAiChat({
        tabId: sender.tab.id,
        aiChatId: message.payload.aiChatId,
        aiChatName: message.payload.aiChatName,
        aiChatIcon: message.payload.aiChatIcon,
        syncInput: true,
        active: false,
    });
    if (sender.tab.active) {
        await activeAiChatByTabId(sender.tab.id);
    }
}

async function aiChatInput(message: Message, sender: chrome.runtime.MessageSender) {
    const syncInputMainSwitch = await activeAiChatStorage.getSyncInputMainSwitch();
    if (!syncInputMainSwitch) return;
    const tabs = await activeAiChatStorage.getAiChats()
    const activeAiChat = tabs.find(t => t.active);
    if (activeAiChat && activeAiChat.tabId === sender.tab.id) {
        const syncInputTabs = tabs.filter(tab => tab.tabId !== sender.tab.id && tab.syncInput);
        for (const tab of syncInputTabs) {
            await chrome.tabs.sendMessage(tab.tabId, {type: 'aiChat.input', payload: message.payload});
        }
    }
}

async function aiChatSend(message: Message, sender: chrome.runtime.MessageSender) {
    const syncInputMainSwitch = await activeAiChatStorage.getSyncInputMainSwitch();
    if (!syncInputMainSwitch) return;
    if (isEmpty(message.payload)) return;

    const tabs = await activeAiChatStorage.getAiChats()
    const activeAiChat = tabs.find(t => t.active);
    if (activeAiChat && activeAiChat.tabId === sender.tab.id) {
        const syncInputTabs = tabs.filter(tab => tab.tabId !== sender.tab.id && tab.syncInput);
        for (const tab of syncInputTabs) {
            await chrome.tabs.sendMessage(tab.tabId, {type: 'aiChat.send', payload: message.payload});
            if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                console.log('send', message, tab);
            }
        }
    }
}

async function aiChatNewChat() {
    const tabs = await activeAiChatStorage.getAiChats();
    for (const tab of tabs) {
        await chrome.tabs.sendMessage(tab.tabId, {type: 'aiChat.newChat'});
    }
}

chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
        console.log('background', message, sender);
    }
    if (message.type === "aiChat.register") {
        eventQueue.push(async () => await registerAiChat(message, sender));
    }
    else if (message.type === "aiChat.input") {
        eventQueue.push(async () => aiChatInput(message, sender));
    }
    else if (message.type === "aiChat.send") {
        eventQueue.push(async () => aiChatSend(message, sender));
    }
    else if (message.type === "aiChat.newChat") {
        await aiChatNewChat();
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    eventQueue.push(async () => await activeAiChatStorage.unregisterAiChat(tabId));
});

chrome.tabs.onUpdated.addListener(async (tabId, activeInfo, tab) => {
    if (activeInfo.url && tab.active) {
        eventQueue.push(async () => await activeAiChatByTabId(tabId))
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    eventQueue.push(async () => await activeAiChatByTabId(activeInfo.tabId))
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
    }
    chrome.windows.get(windowId, { populate: true }, async (window) => {
        if (window.tabs.length > 0) {
            let activeTab = window.tabs.find(tab => tab.active);
            if (activeTab) {
                eventQueue.push(async () => await activeAiChatByTabId(activeTab.id))
            }
        }
    });
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
});

export {}
