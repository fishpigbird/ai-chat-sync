import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/character.png';

class CharacterAiChat extends InputElementAiChat {
    id: string = "Character";
    name: string = "Character";
    icon: string = iconUrl;
    url: string = "https://character.ai";
    matches: string[] = ["*://character.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return this.queryInputElement()?.parentElement?.parentElement?.querySelector("button");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return Array.from(document.querySelectorAll('button'))
            .find(node => node.innerText.trim() === 'New chat');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default CharacterAiChat;
