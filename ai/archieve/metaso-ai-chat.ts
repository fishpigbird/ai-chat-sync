import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/metaso.png';

class MetasoAiChat extends InputElementAiChat {
    id: string = "Metaso";
    name: string = "秘塔搜索";
    icon: string = iconUrl;
    url: string = "https://metaso.cn";
    matches: string[] = ["*://metaso.cn/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea.search-consult-textarea,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button.send-arrow-button');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[aria-label="主页"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }

    input(text: string): void {
        this.pasteTextToInput(text);
    }

    /**
    send(text: string): void {
        setTimeout(() => {
            this.input(text);
            this.enterKeyToInput();
        }, 1000);
    }
        **/
}

export default MetasoAiChat;
