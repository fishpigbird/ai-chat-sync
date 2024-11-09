import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/chatglm.png';

class ChatGLMAiChat extends InputElementAiChat {
    id: string = "ChatGLM";
    name: string = "智谱清言";
    icon: string = iconUrl;
    url: string = "https://chatglm.cn/main/alltoolsdetail";
    matches: string[] = ["*://chatglm.cn/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('#search-input-box textarea,.input-box-inner > textarea,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        //return document.querySelector('.input-wrap > .enter img,.enter img');
        return null;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('.search-box-container > .create-session, .create-session');
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return document.querySelector('div.followup-list');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default ChatGLMAiChat;
