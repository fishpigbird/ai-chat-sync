import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/chatsonic.png';

class ChatsonicAiChat extends InputElementAiChat {
    id: string = "Chatsonic";
    name: string = "Chatsonic";
    icon: string = iconUrl;
    url: string = "https://app.writesonic.com";
    matches: string[] = ["*://app.writesonic.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[placeholder*="How can I help"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return this.queryInputElement()?.parentElement?.nextElementSibling?.querySelector("button");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        const element = document.querySelector('h1.text-n-prose-xs');
        if (element && element.textContent.trim() === 'Chatsonic') {
            return element.closest("button");
        }
        return null;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default ChatsonicAiChat;
