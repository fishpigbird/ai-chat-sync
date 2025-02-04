import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/perplexity.png';

class FeloAiChat extends InputElementAiChat {
    id: string = "felo";
    name: string = "felo";
    icon: string = iconUrl;
    url: string = "https://felo.ai/search";
    matches: string[] = ["*://felo.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {

        // return document.querySelector('textarea');
        return document.querySelector('textarea');

    }

    querySendButtonElement(): HTMLElement | null {
        // return document.querySelector('div.flex.items-center.gap-2 > button');
        return null;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('.divide-y.border-t');
    }

    //不生效 ， 按键没生效， 生效的是 querySendButtonElement
    sendKey(): SendKey[] {
        return  ["Enter"];
    }


    
}

export default FeloAiChat;
