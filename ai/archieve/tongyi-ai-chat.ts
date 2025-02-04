import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/tongyi.png';

class TongYiAiChat extends InputElementAiChat {
    id: string = "TongYi";
    name: string = "通义千问";
    icon: string = iconUrl;
    url: string = "https://tongyi.aliyun.com/qianwen";
    matches: string[] = ["*://tongyi.aliyun.com/qianwen*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('div[class*="chatTextarea"] textarea,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('div[class*="chatInput"] div[class*="operateBtn"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('div[class*="side"] button[class*="addBtn"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div[class*="suggestWrap"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default TongYiAiChat;
