import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/gemini.png';

class GeminiAiChat extends ContenteditableElementAiChat {
    id: string = "Gemini";
    name: string = "Gemini";
    icon: string = iconUrl;
    url: string = "https://gemini.google.com/app";
    matches: string[] = ["*://gemini.google.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null {
        return document.querySelector('.ql-editor,div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('button.send-button');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('.new-chat-button > button,[data-test-id="new-chat-button"] > button');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }

    input(text: string): void {
        this.inputElement.querySelector('p').textContent = text;
    }

    send(text: string): void {
        this.input(text);
        setTimeout(() => {
            const sendButtonElement = this.querySendButtonElement();
            const isButtonDisable = sendButtonElement && sendButtonElement.getAttribute('aria-disabled') === '';
            console.log(sendButtonElement.getAttribute('aria-disabled'))
            if (!isButtonDisable) {
                this.enterKeyToInput();
            }
        }, 1000);
    }
}

export default GeminiAiChat;
