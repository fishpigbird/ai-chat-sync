import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/you.png';

class YouAiChat extends InputElementAiChat {
    id: string = "You";
    name: string = "You";
    icon: string = iconUrl;
    url: string = "https://you.com";
    matches: string[] = ["*://you.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('#search-input-textarea,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[type="submit"],button[data-testid="qb_submit_button"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[data-eventactionname="new-chat"],button[data-testid="chat-layout-new-chat-button"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('[data-testid="suggested-chat-chip"]')?.parentElement;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default YouAiChat;
