import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/lechat.png';

class LeChatAiChat extends InputElementAiChat {
    id: string = "LECHAT";
    name: string = "LE Chat";
    icon: string = iconUrl;
    url: string = "https://chat.mistral.ai/chat";
    matches: string[] = ["*://chat.mistral.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[placeholder="Ask anything!"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return this.queryInputElement()?.parentElement?.querySelector('button[type="submit"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('a[aria-label="New chat"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default LeChatAiChat;
