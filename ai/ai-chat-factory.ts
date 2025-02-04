import ThreeAiChat from '@/ai/archieve/360-ai-chat';
import type { AiChat } from '@/ai/ai-chat';
import BaiChuanAiChat from '@/ai/archieve/baichuan-ai-chat';
import CharacterAiChat from '@/ai/archieve/character-ai-chat';
import ChatGLMAiChat from '@/ai/archieve/chatglm-ai-chat';
import ChatGPTAiChat from '@/ai/chatgpt-ai-chat';
import ChatsonicAiChat from '@/ai/archieve/chatsonic-ai-chat';
import ClaudeAiChat from '@/ai/claude-ai-chat';
import CozeAiChat from '@/ai/archieve/coze-ai-chat';
import CustomAiChat from '@/ai/custom-ai-chat';
import DeepseekAiChat from '@/ai/deepseek-ai-chat';
import DoubaoAiChat from '@/ai/doubao-ai-chat';
import GeminiAiChat from '@/ai/gemini-ai-chat';

import GeminiStudioAiChat from '@/ai/gemini-ai-chat-studio';
import ChatGPTInnoAiChat from '@/ai/chatgpt-ai-chat-inno';
import OmgptAiChat from '@/ai/omgpt-ai-chat';
import FeloAiChat from '@/ai/felo-ai-chat';



import GoogleAiChat from '@/ai/search-google';      
import HaiLuoAiChat from '@/ai/hailuo-ai-chat';
import HuggingAiChat from '@/ai/archieve/hugging-ai-chat';
import KimiAiChat from '@/ai/archieve/kimi-ai-chat';
import LeChatAiChat from '@/ai/archieve/lechat-ai-chat';
import MetaAiChat from '@/ai/archieve/meta-ai-chat';
import MetasoAiChat from '@/ai/archieve/metaso-ai-chat';
import MicrosoftCopilotAiChat from '@/ai/microsoft-copilot-ai-chat';
import PerplexityAiChat from '@/ai/perplexity-ai-chat';
import PoeAiChat from '@/ai/archieve/poe-ai-chat';
import SenseAiChat from '@/ai/archieve/sense-ai-chat';
import TianGongAiChat from '@/ai/archieve/tiangong-ai-chat';
import TongYiAiChat from '@/ai/archieve/tongyi-ai-chat';
import WanZhiAiChat from '@/ai/archieve/wanzhi-ai-chat';
import YiYanAiChat from '@/ai/archieve/yiyan-ai-chat';
import YouAiChat from '@/ai/archieve/you-ai-chat';
import YuanBaoAiChat from '@/ai/archieve/yuanbao-ai-chat';
import { parse } from '@/common/url-match';
import CustomAiChatStorage from '@/storage/custom-ai-chat-storage';

class AiChatFactory {
    static systemAiChats: AiChat[] = [
        new ChatGPTInnoAiChat(),
        new ChatGPTAiChat(),
        new ClaudeAiChat(),
        new MicrosoftCopilotAiChat(),
        new GeminiAiChat(),
        new GeminiStudioAiChat(),
        new GoogleAiChat(),
        new DeepseekAiChat(),
        new OmgptAiChat(),
        new FeloAiChat(),
        new PerplexityAiChat(),

        new HaiLuoAiChat(),
        new DoubaoAiChat(),


        new PoeAiChat(),
        new CozeAiChat(),

        new YouAiChat(),
        new HuggingAiChat(),
        new CharacterAiChat(),
        new LeChatAiChat(),
        new MetaAiChat(),
        new ChatsonicAiChat(),
        new YiYanAiChat(),
        new TongYiAiChat(),
        new KimiAiChat(),
        new TianGongAiChat(),
      
    
        new ChatGLMAiChat(),

        //new XfXingHuoAiChat(),
        new YuanBaoAiChat(),
        new BaiChuanAiChat(),
        //new MetasoAiChat(),
  
        new SenseAiChat(),
        new WanZhiAiChat(),
        new ThreeAiChat(),
    ];

    // 获取所有ai聊天
    // 解释函数
    // 1. 获取自定义ai聊天
    // 2. 获取系统ai聊天
    // 3. 返回所有ai聊天
    static async getAllAiChats(): Promise<AiChat[]> {
        const customAiChatSites = await CustomAiChatStorage.getInstance().getCustomAiChats();
        const customAiChats = customAiChatSites.map(site => {
            if (site.chatInputRuleType === 'custom') {
                return new CustomAiChat(site.id, site.name, site.icon, site.url, [site.matches], site.inputSelector, site.sendButtonSelector, site.sendKeys);
            }
            else {
                const find = this.systemAiChats.find(s => s.id === site.chatInputRule);
                const newAiChat = Object.create(Object.getPrototypeOf(find));
                newAiChat.id = site.id;
                newAiChat.name = site.name;
                newAiChat.icon = site.icon;
                newAiChat.url = site.url;
                newAiChat.matches = [site.matches];
                return newAiChat;
            }
        });

        return [...customAiChats, ...this.systemAiChats];
    }

    // 解释函数
    // 1. 获取所有ai聊天
    // 2. 获取匹配的ai聊天  

    static async getAiChat(url: string): Promise<AiChat | null> {

        return (await this.getAllAiChats()).find(chat => chat.matches.some(m => {
            const reg = parse(m);
            //console.log('reg', reg, reg.test(url), url)
            return reg ? reg.test(url) : false;
        } ));
    }
}

export default AiChatFactory;
