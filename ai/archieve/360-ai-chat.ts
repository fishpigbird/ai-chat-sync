import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/360.png';

class ThreeAiChat extends ContenteditableElementAiChat {
    id: string = "360";
    name: string = "360智脑";
    icon: string = iconUrl;
    url: string = "https://chat.360.com";
    matches: string[] = ["*://chat.360.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('use[href="#icon-aircraft"]')?.closest("button");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('use[href="#icon-conver_add"]')?.closest("div");
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default ThreeAiChat;
