import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/meta.png';

class MetaAiChat extends InputElementAiChat {
    id: string = "Meta";
    name: string = "Meta";
    icon: string = iconUrl;
    url: string = "https://www.meta.ai";
    matches: string[] = ["*://www.meta.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[placeholder*="Ask Meta AI"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('div[aria-label="Send Message"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default MetaAiChat;
