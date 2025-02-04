import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/gemini.png';

class GeminiStudioAiChat extends ContenteditableElementAiChat {
    id: string = "GeminiStudio";
    name: string = "GeminiStudio";
    icon: string = iconUrl;
    url: string = "https://aistudio.google.com/app/prompts/new_chat";
    matches: string[] = ["*://aistudio.google.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null {
        return document.querySelector("ms-autosize-textarea > textarea")
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector("button.run-button")
    }

    queryNewChatButtonElement(): HTMLElement | null {

        return document.querySelector('a[aria-label="Create Prompt"]')
    }

    sendKey(): SendKey[] {
        return ["Ctrl/Cmd+Enter"]
    }

    input(text: string): void {
        this.inputTextToInput(text);
    }

}

export default GeminiStudioAiChat;
