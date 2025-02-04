import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/hailuo.png';

class HaiLuoAiChat extends InputElementAiChat {
    id: string = "HaiLuo.ai";
    name: string = "海螺Global";
    icon: string = iconUrl;
    url: string = "https://hailuo.ai";
    matches: string[] = ["*://hailuo.ai/*", "*://*.hailuo.ai/*"];


    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea#chat-input,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('div#input-send-icon div');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div.system-card-wrapper')?.nextElementSibling as HTMLElement;
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default HaiLuoAiChat;
