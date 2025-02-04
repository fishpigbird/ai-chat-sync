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




    // 绑定同步事件
    // 解释：
    // 1. 找到inputElement
    // 2. 找到sendButtonElement
    // 3. 找到relatedQuestionsElement
    // 4. 绑定事件
    // 5. 如果找到inputElement，则绑定keyup事件，监听输入框的输入
    // 6. 如果找到sendButtonElement，则绑定click事件，监听发送按钮的点击
    // 7. 如果找到relatedQuestionsElement，则绑定click事件，监听相关问题的点击
    //哪里监听回车键？
    // 1. 如果找到inputElement，则绑定keydown事件，监听输入框的输入
    bindSyncEvent(send: (text: string) => void): void {
        const findElementBindSyncEvent = () => {
            const inputElement = this.queryInputElement();

            // 如果找到inputElement，则绑定keyup事件，监听输入框的输入
            if (inputElement && (!this.inputElement || this.inputElement !== inputElement)) {
                this.inputElement = inputElement;
                // 监听输入框的输入
                this.inputElement.addEventListener('keyup', this.recordInputValueEvent());
                // 监听回车键
                this.inputElement.addEventListener('keydown', this.keySendEvent(send));
                // 监听发送按钮的点击

                if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                    console.log('find inputElement', inputElement)
                }
            }



            // 监听发送按钮的点击
            const sendButtonElement = this.querySendButtonElement();
            if (sendButtonElement && (!this.sendButtonElement || this.sendButtonElement !== sendButtonElement)) {
                this.sendButtonElement = sendButtonElement;
                this.sendButtonElement.addEventListener('click',  this.buttonSendEvent(send));
                // 监听发送按钮的点击
                if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                    console.log('find sendButtonElement', sendButtonElement)
                }
            }


            
            // 监听相关问题的点击
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
        // 1. 获取输入框的值
        // 2. 判断是否是删除键
        // 3. 如果是删除键，则不记录
        // 4. 如果不是删除键，则记录
        // 5. 如果输入框的值为空，则不记录
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

            // 监听回车键
            const isKeySend = sendKey && ((sendKey.includes("Enter") && e.key === "Enter") || (sendKey.includes("Ctrl/Cmd+Enter") && (e.ctrlKey || e.metaKey) && e.key === "Enter"));
            // e.isComposing的作用是避免输入法按下回车键选择文字被当成发送操作

            // 如果按下回车键，并且是发送键，并且不是输入法选择文字，则发送
            if (isShiftEnter || !isKeySend || e.isComposing) { return }

            // 如果输入框的值不为空，则发送
            if (!isEmpty(this.inputValue)) {
                send(this.inputValue);
                this.inputValue = '';
            }
        }
    }

    // 监听发送按钮的点击
    buttonSendEvent(send: (text: string) => void): (e: Event) => void {
        return (e) => {
            // 监听发送按钮的点击

            if (process.env.PLASMO_PUBLIC_DEBUG === "true") {

                console.log('button send:', this, e);
            }

            if (!this.active) { return }
            if (!isEmpty(this.inputValue)) {
                send(this.inputValue);
            }
        };
    }

    // 监听相关问题的点击
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

    // 粘贴文本到输入框
    pasteTextToInput(text: string): void {
        if (this.inputElement) {
            this.inputElement.focus();
            const clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', text);
            const pasteEvent = new ClipboardEvent('paste', { clipboardData });
            this.inputElement.dispatchEvent(pasteEvent);
        }
    }

    // 输入文本到输入框
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

    // 回车键到输入框
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
