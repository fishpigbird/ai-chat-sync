import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/doubao.png';

class DoubaoAiChat extends InputElementAiChat {
    id: string = "Doubao";
    name: string = "豆包";
    icon: string = iconUrl;
    url: string = "https://www.doubao.com/chat";
    matches: string[] = ["*://www.doubao.com/chat*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[data-testid="chat_input_input"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button#flow-end-msg-send,button[data-testid="chat_input_send_button"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('div[data-testid="create_conversation_button"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div[class*="suggest-message-list-wrapper"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default DoubaoAiChat;
