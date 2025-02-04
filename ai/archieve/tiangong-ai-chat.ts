import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/tiangong.png';

class TianGongAiChat extends InputElementAiChat {
    id: string = "TianGong";
    name: string = "天工";
    icon: string = iconUrl;
    url: string = "https://www.tiangong.cn";
    matches: string[] = ["*://www.tiangong.cn/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('.research textarea,.mainInput textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('.sendDiv,.sendBtn');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('.searchHistoryDrawer div');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        let element = document.querySelector('div[data-entity="suggestion"]')?.parentElement;
        if (!element) {
            element = document.querySelector('div.suggestionChatLiContent');
        }
        return element;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default TianGongAiChat;
