import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/you.png';

class PiAiChat extends InputElementAiChat {
    id: string = "Pi";
    name: string = "Pi";
    icon: string = iconUrl;
    url: string = "https://pi.ai/talk";
    matches: string[] = ["*://pi.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea.t-body-chat,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[aria-label="Submit text"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[data-eventactionname="new-chat"],button[data-testid="chat-layout-new-chat-button"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default PiAiChat;
