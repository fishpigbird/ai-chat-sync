import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/perplexity.png';

class PerplexityAiChat extends InputElementAiChat {
    id: string = "Perplexity";
    name: string = "Perplexity";
    icon: string = iconUrl;
    url: string = "https://www.perplexity.ai";
    matches: string[] = ["*://www.perplexity.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[aria-label="Submit"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('a[aria-label="Home"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('.divide-y.border-t');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default PerplexityAiChat;
