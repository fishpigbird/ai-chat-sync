import { type SendKey } from '@/ai/abstract-ai-chat';
import InputElementAiChat from '@/ai/input-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/deepseek.png';

class DeepseekAiChat extends InputElementAiChat {
    id: string = "DeepSeek";
    name: string = "DeepSeek";
    icon: string = iconUrl;
    url: string = "https://chat.deepseek.com";
    matches: string[] = ["*://chat.deepseek.com/*"];

    queryInputElement() : HTMLInputElement | HTMLTextAreaElement | null {
        return document.querySelector('#chat-input,textarea');
    }

    querySendButtonElement(): HTMLElement | null {
        //const inputElement = this.queryInputElement();
        //return inputElement?.parentElement?.querySelector('div[role="button"]')?.querySelector('div:nth-child(3)');
        return document.querySelector("#root > div > div > div.a9052914 > div > div.aa3209e7._2125ddf > div.d1d7a2bf > div > div._89d4d19 > div:nth-child(3)");
    }

    queryNewChatButtonElement(): HTMLElement | null {
        //兼容“New chat”或者“开启新对话”
     
        return Array.from(document.querySelectorAll('div'))
            .find(div => Array.from(div.childNodes)
                    // .some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '开启新对话'   ));
                    //.some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'New chat'   ));
                    //或者
                    .some(node => node.nodeType === Node.TEXT_NODE && (node.textContent.trim() === '开启新对话' || node.textContent.trim() === 'New chat')));



    }


    //deepseek 第一条消息发送的时候，获取失败，其他页面没有更新
    sendKey(): SendKey[] {
        return ["Enter"];
    }
}

export default DeepseekAiChat;
