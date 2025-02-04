import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/perplexity.png';

class FeloAiChat extends InputElementAiChat {
    id: string = "felo";
    name: string = "felo";
    icon: string = iconUrl;
    url: string = "https://felo.ai/search";
    matches: string[] = ["*://felo.ai/*"];

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {

        // return document.querySelector('textarea');
        return document.querySelector('textarea');

    }

    querySendButtonElement(): HTMLElement | null {
        // return document.querySelector('div.flex.items-center.gap-2 > button');
        return null;
    }

    queryNewChatButtonElement(): HTMLElement | null {
        return null;
    }

    hasRelatedQuestions(): boolean {
        return true;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        const elements = document.querySelectorAll('.flex.flex-col.gap-4.w-full');

        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            console.log(lastElement); // 这将打印最后一个匹配的元素
            // 你可以在这里对 lastElement 进行操作
            return lastElement as HTMLElement;
        } else {
            console.log('No elements found matching the selector.');
        }
        // 获取所有div元素
        //return document.querySelector('.mt-8.animate-\[fadeIn_1s_ease-in-out\] > .flex.flex-col.gap-4.w-full');
    }

    //不生效 ， 按键没生效， 生效的是 querySendButtonElement
    sendKey(): SendKey[] {
        return  ["Enter"];
    }


    
}

export default FeloAiChat;
