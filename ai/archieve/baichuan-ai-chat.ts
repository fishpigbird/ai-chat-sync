import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/baichuan.png';

class BaiChuanAiChat extends InputElementAiChat {
    id: string = "BaiChuan";
    name: string = "百小应";
    icon: string = iconUrl;
    url: string = "https://ying.baichuan-ai.com/chat";
    matches: string[] = ["*://ying.baichuan-ai.com/chat*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return this.queryInputElement()?.parentElement?.nextElementSibling?.querySelector("button.group");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[data-state="closed"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default BaiChuanAiChat;
