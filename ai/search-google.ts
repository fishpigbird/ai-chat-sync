import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/gemini.png';

class GoogleAiChat extends InputElementAiChat {
    id: string = "Google";
    name: string = "Google";
    icon: string = iconUrl;
    url: string = "https://www.google.com/search?q=utada";
    matches: string[] = ["*://www.google.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[name="q"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[type="submit"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default GoogleAiChat;
