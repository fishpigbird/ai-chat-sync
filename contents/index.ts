import type { AiChat } from '@/ai/ai-chat';
import AiChatFactory from '@/ai/ai-chat-factory';

(async () => {
    const aiChat: AiChat = await AiChatFactory.getAiChat(window.location.href);
    if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
        console.dir(aiChat)
    }
    if (aiChat) {
        chrome.runtime.sendMessage({type: 'aiChat.register', payload: { aiChatId: aiChat.id, aiChatName: aiChat.name, aiChatIcon: aiChat.icon } }) ;

        const sendEvent = (text: string) => chrome.runtime.sendMessage({type: 'aiChat.send', payload: text });
        aiChat.bindSyncEvent(sendEvent);

        const messageHandle = (message, sender, sendResponse) => {
            if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                console.log('onMessage', message, sender)
            }
            if (message.type === 'aiChat.input') {
                aiChat.input(message.payload);
            }
            else if (message.type === 'aiChat.send') {
                aiChat.send(message.payload);
            }
            else if (message.type === 'aiChat.activate') {
                aiChat.active = true;
            }
            else if (message.type === 'aiChat.deactivate') {
                aiChat.active = false;
            }
            else if (message.type === 'aiChat.newChat') {
                aiChat.newChat();
            }
        };
        chrome.runtime.onMessage.addListener(messageHandle);
    }
})();

export {}
