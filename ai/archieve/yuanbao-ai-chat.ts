import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/yuanbao.png';

class YuanBaoAiChat extends ContenteditableElementAiChat {
    id: string = "YuanBao";
    name: string = "腾讯元宝";
    icon: string = iconUrl;
    url: string = "https://yuanbao.tencent.com/chat";
    matches: string[] = ["*://yuanbao.tencent.com/chat*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null {
        return document.querySelector('.chat-input-editor div[contenteditable="true"],div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('a[class*="style__send-btn"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[class*="new-chat"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div.hyc-content-option__content');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default YuanBaoAiChat;
