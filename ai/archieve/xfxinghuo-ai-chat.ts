import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/xinghuo.png';

class XfXingHuoAiChat extends InputElementAiChat {
    id: string = "XfXingHuo";
    name: string = "讯飞星火";
    icon: string = iconUrl;
    url: string = "https://xinghuo.xfyun.cn/desk";
    matches: string[] = ["*://xinghuo.xfyun.cn/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null {
        return document.querySelector('#ask-window textarea,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('div[class*="ask-window_small_input_btn"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('div[class*="pages_find_friend"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default XfXingHuoAiChat;
