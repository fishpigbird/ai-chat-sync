import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/yiyan.png';

class YiYanAiChat extends ContenteditableElementAiChat {
    id: string = "YiYan";
    name: string = "文心一言";
    icon: string = iconUrl;
    url: string = "https://yiyan.baidu.com";
    matches: string[] = ["*://yiyan.baidu.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('div.yc-editor,div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('div.yc-editor-container')?.parentElement?.parentElement?.nextElementSibling?.querySelector("span");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return Array.from(document.querySelectorAll('#card_list_id span'))
            .find(node => (node as HTMLElement).innerText.trim() === '你可以继续问我：')
            ?.parentElement?.nextElementSibling as HTMLElement;
    }


    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default YiYanAiChat;
