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

    // 输入文本
    input(text: string): void {
        // 输入文本 这里为什么有p ：
        // 因为这里是一个富文本编辑器，所以需要找到p标签，然后设置文本
        this.inputElement.querySelector('p').textContent = text;
    }


    // 发送文本
    // 解释：
    // 1. 输入文本
    // 2. 等待1秒
    // 3. 发送按钮是否可用
    // 4. 如果可用，则发送文本
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
