import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/chatgpt.png';

class ChatGPTInnoAiChat extends ContenteditableElementAiChat {
    id: string = "ChatGPTInno";
    name: string = "ChatGPTInno";
    icon: string = iconUrl;
    url: string = "https://chatgpt.com/?temporary-chat=true";
    matches: string[] = ["*://chatgpt.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('div.ProseMirror,div[contenteditable="true"]');
    }

    querySendButtonElement(): HTMLElement | null {
        let sendButton = document.querySelector('button[data-testid="send-button"] svg');
        if (!sendButton) {
            const inputElement = this.queryInputElement();
            const buttons = inputElement?.parentElement?.parentElement?.querySelectorAll('button');
            if (buttons && buttons.length > 0) {
                sendButton = buttons[buttons.length - 1];
            }
        }
        return sendButton as HTMLElement;
    }
    
    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector("body > div.flex.h-full.w-full.flex-col > div > div.relative.flex.h-full.w-full.flex-row.overflow-hidden > div.z-\\[21\\].flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0 > div > div > div > nav > div.flex.justify-between.flex.h-\\[60px\\].items-center.md\\:h-header-height > div > span:nth-child(2) > button")
    }

    sendKey(): SendKey[] {
        return ["Enter", "Ctrl/Cmd+Enter"];
    }

    send(text: string): void {
        window.scrollTo(0, document.body.scrollHeight);
        super.send(text);
    }
}

export default ChatGPTInnoAiChat;
