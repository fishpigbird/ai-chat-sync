import { type SendKey } from '@/ai/abstract-ai-chat';
import ContenteditableElementAiChat from '@/ai/contenteditable-element-ai-chat';
// @ts-ignore
import iconUrl from 'data-url:@/assets/chatgpt.png';

class OmgptAiChat extends ContenteditableElementAiChat {
    id: string = "omgpt";
    name: string = "omgpt";
    icon: string = iconUrl;
    url: string = "https://ohmygpt.com/chat/";
    matches: string[] = [
        "*://*.ohmygpt.com/*",  // 
        "*://ohmygpt.com/*"     // 
    ]; //这里是匹配是否激活同步用的，不是管理是否触发脚本用的。
    //所有网页都会触发脚本；
    //但只有matches才会触发同步。
    
    // /^(http|https):\/\/[^/]*?ohmygpt\.com\/chat\/?p=1\/?$/
    // /^(http|https):\/\/ohmygpt\.com\/chat\/?p=1\/?$/

    constructor() {
        super();
        console.log('omgpt constructor');   
        this.autoClickNewChatButton();
    }

    queryInputElement(): HTMLInputElement | HTMLTextAreaElement | null {

        
        
        return document.querySelector('textarea.n-input__textarea-el');
        // element 写入文本 "test" 用.input

    }

    querySendButtonElement(): HTMLElement | null {
         

        return document.querySelector("#app > div > div > div.fixed.z-10.right-0.bottom-20.top-\\[4rem\\].left-0.bg-gray-50.dark\\:bg-black.rounded-lg.sm\\:left-64 > div.fixed.dark\\:bg-black.z-10.right-12.bottom-0.left-0.flex.m-2.sm\\:left-64 > button.fixed.right-4.bottom-2.transform.-translate-y-1\\/2.mr-0.px-2.py-2.text-white.bg-blue-500.rounded-md.shadow-md.hover\\:bg-blue-600.focus\\:outline-none.focus\\:ring-2.focus\\:ring-blue-500.disabled\\:opacity-50.disabled\\:cursor-not-allowed")
   
    }
    
    queryNewChatButtonElement(): HTMLElement | null {

        // return document.querySelector('.flex.hover\:shadow-md.hover\:cursor-pointer.items-center.border-dashed.border-2.border-gray-400.rounded-lg.mr-3.ml-1.p-2.mb-4.flex-col.gap-2.cursor-pointer.transition-all.duration-200.ease-in-out.hover\:bg-gray-100.dark\:hover\:bg-gray-800.dark\:hover\:border-gray-700');
       return document.querySelector("#app > div > div > aside > div.n-layout-sider-scroll-container > div > div > div > div > div.n-scrollbar-container > div > div > div:nth-child(1)")
   
    }

    sendKey(): SendKey[] {
        return ["Enter"];
    }

    // send(text: string): void {
    //     window.scrollTo(0, document.body.scrollHeight);
    //     super.send(text);// 这里为什么需要super.send(text)  
    // }

    input(text: string): void {
        this.inputTextToInput(text);
    }

    autoClickNewChatButton(): void {
        console.log("autoClickNewChatButton");
        let hasClicked = false;
        const tryClick = () => {
            if (hasClicked) return;
            const newChatButton = this.queryNewChatButtonElement();
            if (newChatButton && !this.active) {
                newChatButton.click();
                hasClicked = true;
                observer.disconnect();
                if (process.env.PLASMO_PUBLIC_DEBUG === "true") {
                    console.log('auto clicked new chat button');
                }
            }
        };

        const observer = new MutationObserver(tryClick);
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(() => {
            tryClick();
            setTimeout(() => observer.disconnect(), 3000);
        }, 1000);
    }

}

export default OmgptAiChat;
