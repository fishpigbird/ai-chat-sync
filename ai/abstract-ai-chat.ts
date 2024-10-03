import type { AiChat } from '@/ai/ai-chat';
import { debounce, isEmpty } from '@/common/functions';

type SendKey = "Enter" | "Ctrl/Cmd+Enter";

abstract class AbstractAiChat implements AiChat {
    id: string;
    name: string;
    icon: string;
    url: string;
    matches: string[];
    active: boolean = false;
    inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement | null;
    sendButtonElement: HTMLElement | null;
    relatedQuestionsElement: HTMLElement | null;
    inputValue: string;
    abstract queryInputElement(): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null;
    abstract querySendButtonElement(): HTMLElement | null;
    abstract queryNewChatButtonElement(): HTMLElement | null;
    abstract hasRelatedQuestions(): boolean;
    abstract queryRelatedQuestionsElement(): HTMLElement | null;
    abstract sendKey(): SendKey[] | null;
    abstract input(text: string): void;

    isLoaded(): boolean {
        return this.queryInputElement() != null && this.querySendButtonElement() != null;
    }

    bindSyncEvent(send: (text: string) => void): void {
        const findElementBindSyncEvent = () => {
            const inputElement = this.queryInputElement();
            if (inputElement && (!this.inputElement || this.inputElement !== inputElement)) {
                this.inputElement = inputElement;
                this.inputElement.addEventListener('keyup', this.recordInputValueEvent());
                this.inputElement.addEventListener('keydown', this.keySendEvent(send));

                if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                    console.log('find inputElement', inputElement)
                }
            }

            const sendButtonElement = this.querySendButtonElement();
            if (sendButtonElement && (!this.sendButtonElement || this.sendButtonElement !== sendButtonElement)) {
                this.sendButtonElement = sendButtonElement;
                this.sendButtonElement.addEventListener('click',  this.buttonSendEvent(send));

                if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                    console.log('find sendButtonElement', sendButtonElement)
                }
            }

            if (this.hasRelatedQuestions()) {
                const relatedQuestionsElement = this.queryRelatedQuestionsElement();
                if (relatedQuestionsElement && (!this.relatedQuestionsElement || this.relatedQuestionsElement !== relatedQuestionsElement)) {
                    this.relatedQuestionsElement = relatedQuestionsElement;
                    this.relatedQuestionsElement.addEventListener('click', this.relatedQuestionsSendEvent(relatedQuestionsElement, send))

                    if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                        console.log('find relatedQuestionsElement', relatedQuestionsElement);
                    }
                }
            }
        }

        const mutCallback = (mutationsList, observer) => {
            findElementBindSyncEvent();
        };

        let count = 0;
        const maxCount = 3;
        const intervalId = setInterval(() => {
            findElementBindSyncEvent();
            count++;
            if (count >= maxCount) {
                clearInterval(intervalId);
                const observer = new MutationObserver(mutCallback);
                observer.observe(document.body, {childList: true, subtree: true});
            }
        }, 1000);
    }

    send(text: string): void {
        this.input(text);
        setTimeout(() => {
            if (this.sendButtonElement) {
                const clickEvent = new MouseEvent('click', {bubbles: true, cancelable: true});
                this.sendButtonElement.dispatchEvent(clickEvent);
            }
            else {
                this.enterKeyToInput();
            }
        }, 1000);
    }

    newChat(): void {
        const newChatButton = this.queryNewChatButtonElement();
        if (newChatButton) {
            newChatButton.click();
        }
        else {
            window.location.href = this.url;
        }
    }

    recordInputValueEvent(): (e: KeyboardEvent) => void {
        // 按下回车键发送的时候有时输入框的值会清空获取不到，所以这里实时记录输入的聊天内容，
        return (e) => {
            const inputValue = this.getInputElementValue(this.inputElement);
            const isEmptyByDelete = isEmpty(inputValue) && (e.key === "Delete" || e.key === "Backspace");
            if (!isEmpty(inputValue) || isEmptyByDelete) {
                this.inputValue = inputValue;
            }
        }
    }

    keySendEvent(send: (text: string) => void): (e: KeyboardEvent) => void {
        // 按下回车键发送的时候有时输入框的值会清空获取不到，所以这里实时记录输入的聊天内容，
        return (e: KeyboardEvent) => {
            if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                console.log('key send:', this, e);
            }
            if (!this.active) { return }
            const sendKey = this.sendKey();
            const isShiftEnter = e.shiftKey && e.key === "Enter";
            const isKeySend = sendKey && ((sendKey.includes("Enter") && e.key === "Enter") || (sendKey.includes("Ctrl/Cmd+Enter") && (e.ctrlKey || e.metaKey) && e.key === "Enter"));
            // e.isComposing的作用是避免输入法按下回车键选择文字被当成发送操作
            if (isShiftEnter || !isKeySend || e.isComposing) { return }
            if (!isEmpty(this.inputValue)) {
                send(this.inputValue);
                this.inputValue = '';
            }
        }
    }

    buttonSendEvent(send: (text: string) => void): (e: Event) => void {
        return (e) => {
            if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                console.log('button send:', this, e);
            }
            if (!this.active) { return }
            if (!isEmpty(this.inputValue)) {
                send(this.inputValue);
            }
        };
    }

    relatedQuestionsSendEvent(parentElement: HTMLElement, send: (text: string) => void): (e: Event) => void {
        return (e: Event) => {
            let target = e.target as HTMLElement;
            if (target.tagName === "svg") {
                target = target.parentElement?.parentElement;
            }
            if (parentElement.contains(target) && target !== parentElement) {
                const textContent = target.shadowRoot ? target.shadowRoot.textContent?.trim() : target.textContent?.trim() || '';
                console.log('relatedQuestionsSendEvent textContent', textContent);
                if (!isEmpty(textContent)) {
                    send(textContent);
                }
            }
        };
    }

    pasteTextToInput(text: string): void {
        if (this.inputElement) {
            this.inputElement.focus();
            const clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', text);
            const pasteEvent = new ClipboardEvent('paste', { clipboardData });
            this.inputElement.dispatchEvent(pasteEvent);
        }
    }

    inputTextToInput(text: string): void {
        if (this.inputElement) {
            this.inputElement.focus();
            if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLTextAreaElement) {
                this.inputElement.value = text;
            }
            const inputEvent = new Event('input', {bubbles: true, cancelable: true});
            this.inputElement.dispatchEvent(inputEvent);
        }
    }

    enterKeyToInput(): void {
        if (this.inputElement) {
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            this.inputElement.dispatchEvent(event);
        }
    }

    getInputElementValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLElement): string {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return element.value;
        }
        else if (element instanceof HTMLElement) {
            return element.innerText;
        }
        return '';
    }
}

export default AbstractAiChat;
export type { SendKey }
