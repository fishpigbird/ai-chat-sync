import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';

class CustomAiChat extends InputElementAiChat {
    inputSelector: string;
    sendButtonSelector: string;
    sendKeys: SendKey[] | null;

    constructor(id: string, name: string, icon: string, url: string, matches: string[], inputSelector: string, sendButtonSelector: string, sendKey: SendKey | null) {
        super();
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.url = url;
        this.matches = matches;
        this.inputSelector = inputSelector;
        this.sendButtonSelector = sendButtonSelector;
        this.sendKeys = sendKey ? [ sendKey ] : null;
    }

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        let input = document.querySelector(this.inputSelector);
        return input as HTMLInputElement | HTMLTextAreaElement;
    }

    querySendButtonElement(): HTMLElement | null {
        let sendButton = document.querySelector(this.sendButtonSelector);
        return sendButton as HTMLElement;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    sendKey(): SendKey[] | null {
        return this.sendKeys;
    }
}

export default CustomAiChat;
