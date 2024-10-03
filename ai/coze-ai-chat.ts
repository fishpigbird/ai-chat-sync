import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/coze.png';

class CozeAiChat extends InputElementAiChat {
    id: string = "Coze";
    name: string = "Coze";
    icon: string = iconUrl;
    url: string = "https://www.coze.com";
    matches: string[] = ["*://www.coze.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[data-testid="bot.ide.chat_area.chat_input.textarea"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[data-testid="bot-home-chart-send-button"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button[data-testid="chat-input-clear-context-button"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default CozeAiChat;
