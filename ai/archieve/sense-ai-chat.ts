import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/sense.png';

class SenseAiChat extends InputElementAiChat {
    id: string = "Sense";
    name: string = "商量";
    icon: string = iconUrl;
    url: string = "https://chat.sensetime.com";
    matches: string[] = ["*://chat.sensetime.com/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('textarea[class*="QuestionInput"],textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        return document.querySelector('img[class*="QuestionInput_v2_RightBtnIcon"]');
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return document.querySelector('button.sider-add-btn');
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default SenseAiChat;
