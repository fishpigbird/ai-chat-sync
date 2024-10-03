import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/kimi.png';

class KimiAiChat extends ContenteditableElementAiChat {
    id: string = "Kimi";
    name: string = "Kimi";
    icon: string = iconUrl;
    url: string = "https://kimi.moonshot.cn";
    matches: string[] = ["*://kimi.moonshot.cn/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('div[contenteditable="true"],div[data-testid="msh-chatinput-editor"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button#send-button,button[data-testid="msh-chatinput-send-button"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('div[data-testid="msh-sidebar-new"]');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div.contentbottom-hole');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default KimiAiChat;
