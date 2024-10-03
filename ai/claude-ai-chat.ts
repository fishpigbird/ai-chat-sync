import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/claude.png';

class ClaudeAiChat extends ContenteditableElementAiChat {
    id: string = "Claude";
    name: string = "Claude";
    icon: string = iconUrl;
    url: string = "https://claude.ai";
    matches: string[] = ["*://claude.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null {
        return document.querySelector('div.ProseMirror,div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[aria-label*="Send Message"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default ClaudeAiChat;
