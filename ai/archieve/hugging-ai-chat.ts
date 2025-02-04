import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/hugging.png';

class HuggingAiChat extends InputElementAiChat {
    id: string = "HuggingChat";
    name: string = "HuggingChat";
    icon: string = iconUrl;
    url: string = "https://huggingface.co/chat";
    matches: string[] = ["*://huggingface.co/chat/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[placeholder*="Ask anything"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        const inputElement = this.queryInputElement();
        return inputElement?.closest('form')?.querySelector("button[type='submit']");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('a[href="/chat/"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default HuggingAiChat;
