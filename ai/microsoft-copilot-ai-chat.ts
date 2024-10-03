import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/copilot.png';

class MicrosoftCopilotAiChat extends InputElementAiChat {
    id: string = "Copilot";
    name: string = "Copilot";
    icon: string = iconUrl;
    url: string = "https://copilot.microsoft.com";
    matches: string[] = ["*://copilot.microsoft.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        const serpMain = document.querySelector('.cib-serp-main');
        const barMain = serpMain?.shadowRoot?.querySelector('#cib-action-bar-main');
        const textInput = barMain?.shadowRoot?.querySelector('cib-text-input');
        let input = textInput ? textInput?.shadowRoot?.querySelector('#searchbox,textarea') : barMain?.shadowRoot?.querySelector('#searchbox,textarea');

        return input as HTMLInputElement;
    }

    querySendButtonElement(): HTMLElement | null {
        const serpMain = document.querySelector('.cib-serp-main');
        const barMain = serpMain?.shadowRoot?.querySelector('#cib-action-bar-main');
        let sendButton = barMain?.shadowRoot?.querySelector('div.control.submit > button,button[aria-label="Submit"],button[aria-label="提交"]');

        return sendButton as HTMLInputElement;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        const serpMain = document.querySelector('.cib-serp-main');
        const barMain = serpMain?.shadowRoot?.querySelector('#cib-action-bar-main');
        return barMain?.shadowRoot?.querySelector('div.button-compose-wrapper > button,button[aria-label="New topic"],button[aria-label="新主题"]') as HTMLElement;
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        const serpMain = document.querySelector('.cib-serp-main');
        const conversationMain = serpMain?.shadowRoot?.querySelector('#cib-conversation-main');
        const suggestionBar = conversationMain?.shadowRoot?.querySelector('[suggestion-bar-visible]');
        return suggestionBar?.shadowRoot?.querySelector('.suggestion-items');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default MicrosoftCopilotAiChat;
