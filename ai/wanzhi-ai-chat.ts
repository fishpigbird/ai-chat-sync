import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/wanzhi.png';

class WanZhiAiChat extends InputElementAiChat {
    id: string = "WanZhi";
    name: string = "万知";
    icon: string = iconUrl;
    url: string = "https://www.wanzhi.com";
    matches: string[] = ["*://www.wanzhi.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea.chat-input,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        let sendButton = document.querySelector('.send-button button');
        if (!sendButton) {
            sendButton = document.querySelector('.send-icon');
        }
        return sendButton as HTMLElement | null;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('.left-node-new-chat');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default WanZhiAiChat;
