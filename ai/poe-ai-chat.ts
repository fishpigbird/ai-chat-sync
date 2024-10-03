import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/poe.png';

class PoeAiChat extends InputElementAiChat {
    id: string = "Poe";
    name: string = "Poe";
    icon: string = iconUrl;
    url: string = "https://poe.com";
    matches: string[] = ["*://poe.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[class*="GrowingTextArea_textArea"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button[class*="ChatMessageSendButton_sendButton"],button[class*="ChatMessageInputContainer_sendButton"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('span[class*="ChatPageNavbar_rightNavItemWrapper"] > a');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('section[class*="ChatMessageFollowupActions"]');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default PoeAiChat;
