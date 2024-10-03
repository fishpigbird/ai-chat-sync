import AiChatFactory from '@/ai/ai-chat-factory';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ActiveAiChatStorage, { type ActiveAiChat } from '@/storage/active-ai-chat-storage';
import AiChatSettingStorage from '@/storage/ai-chat-setting-storage';
import { useStorage } from '@plasmohq/storage/dist/hook';
import { MessageSquarePlus, MessageSquareShare, MessageSquareText, MessageSquareX, Settings } from 'lucide-react';

const activeAiChatStorage = ActiveAiChatStorage.getInstance();
const aiChatSettingStorage = AiChatSettingStorage.getInstance();

function Main({ setMenu }) {
    const [activeAiChats] = useStorage<ActiveAiChat[]>({
        key: activeAiChatStorage.storageKey,
        instance: activeAiChatStorage.storage
    }, []);
    const [syncInputMainSwitch] = useStorage<boolean>({
        key: activeAiChatStorage.syncInputMainSwitchStorageKey,
        instance: activeAiChatStorage.storage
    }, true)

    const quickOpenAiChats = async () => {
        const quickOpenMethod = await aiChatSettingStorage.getQuickOpenMethod();
        const allAiChats = await AiChatFactory.getAllAiChats();
        const quickOpenAiChatIds = await aiChatSettingStorage.getQuickOpenAiChat();
        const quickOpenAiChatUrls = allAiChats.filter(a => quickOpenAiChatIds.includes(a.id)).map(a => a.url);
        if (quickOpenAiChatUrls.length === 0) {
            return;
        }
        if (quickOpenMethod === 'tab') {
            quickOpenAiChatUrls.forEach(url => {
                chrome.tabs.create({ url });
            })
        }
        else if (quickOpenMethod === 'newWindowTab') {
            chrome.windows.create({ url: quickOpenAiChatUrls });
        }
        else if (quickOpenMethod === 'windowHorizontal') {
            chrome.system.display.getInfo((displays) => {
                const screenWidth = displays[0].workArea.width;
                const screenHeight = displays[0].workArea.height;
                const numberOfWindows = quickOpenAiChatUrls.length;
                const windowWidth = Math.floor(screenWidth / numberOfWindows);
                const windowHeight = screenHeight; // 保持窗口全高
                for (let i = 0; i < numberOfWindows; i++) {
                    chrome.windows.create({
                        url: quickOpenAiChatUrls[i],
                        type: 'normal',
                        left: i * windowWidth,
                        top: 0,
                        width: windowWidth,
                        height: windowHeight
                    });
                }
            });
        }
        else if (quickOpenMethod === 'windowVertical') {
            chrome.system.display.getInfo((displays) => {
                const screenWidth = displays[0].workArea.width;
                const screenHeight = displays[0].workArea.height;
                const numberOfWindows = quickOpenAiChatUrls.length;
                const windowWidth = screenWidth; // 保持窗口全宽
                const windowHeight = Math.floor(screenHeight / numberOfWindows);
                chrome.windows.create({
                    url: quickOpenAiChatUrls[0],
                    type: 'normal',
                    left: 0,
                    top: 0,
                    width: windowWidth,
                    height: windowHeight
                }, function(newWindow) {
                    chrome.windows.get(newWindow.id, {}, function(window) {
                        const offset = window.top;
                        for (let i = 1; i < numberOfWindows; i++) {
                            chrome.windows.create({
                                url: quickOpenAiChatUrls[i],
                                type: 'normal',
                                left: 0,
                                top: i * windowHeight + offset,
                                width: windowWidth,
                                height: windowHeight
                            });
                        }
                    });
                });
            });

        }
        else if (quickOpenMethod === 'windowGrid') {
            chrome.system.display.getInfo((displays) => {
                const screenWidth = displays[0].workArea.width;
                const screenHeight = displays[0].workArea.height;
                const minWindowWidth = 600; // 最小窗口宽度
                const maxCols = Math.floor(screenWidth / minWindowWidth); // 每排最多显示的窗口数
                const windowWidth = Math.floor(screenWidth / maxCols); // 实际窗口宽度
                const numberOfWindows = quickOpenAiChatUrls.length; // 需要打开的窗口数量
                const maxRows = Math.ceil(numberOfWindows / maxCols);
                const windowHeight = Math.floor(screenHeight / maxRows);

                chrome.windows.create({
                    url: quickOpenAiChatUrls[0],
                    type: 'normal',
                    left: 0,
                    top: 0,
                    width: windowWidth,
                    height: windowHeight
                }, function(newWindow) {
                    chrome.windows.get(newWindow.id, {}, function(window) {
                        const offset = window.top;
                        for (let i = 1; i < numberOfWindows; i++) {
                            const col = i % maxCols; // 当前窗口所在列
                            const row = Math.floor(i / maxCols); // 当前窗口所在排
                            chrome.windows.create({
                                url: quickOpenAiChatUrls[i],
                                type: 'normal',
                                left: col * windowWidth,
                                top: row > 0 ? row * windowHeight + offset : row * windowHeight,
                                width: windowWidth,
                                height: windowHeight
                            });
                        }
                    });
                });
            });
        }
    }

    const closeAllOpenAiChat = async () => {
        for (let activeAiChat of activeAiChats) {
            chrome.tabs.remove(activeAiChat.tabId);
        }
        await activeAiChatStorage.unregisterAllAiChat();
    }

    const newChat = () => {
        chrome.runtime.sendMessage({type: 'aiChat.newChat'});
    }

    const openOptionsPage = () => {
        chrome.runtime.openOptionsPage();
    }

    return (
        <div className="w-[300px] p-4">
            <div className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center text-sm space-x-1">
                        <span>{chrome.i18n.getMessage("enableChatSynchronization")}</span>
                    </div>
                </div>
                <Switch checked={syncInputMainSwitch} onCheckedChange={(checked) => activeAiChatStorage.setSyncInputMainSwitch(checked)} />
            </div>
            <div className="mt-1 space-y-0.5">
                {activeAiChats.map(tab => (
                    <div key={tab.tabId} className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-0.5">
                            <img className={'w-4'} src={tab.aiChatIcon} />
                            <div className="text-xs ">
                                {tab.aiChatName}
                            </div>
                        </div>
                        <Switch disabled={!syncInputMainSwitch} key={tab.tabId} checked={tab.syncInput} onCheckedChange={(checked) => activeAiChatStorage.setAiChatSyncInput(tab.tabId, checked)} />
                    </div>
                ))}
            </div>
            <Separator className="my-2" />
            <div className="flex flex-row items-center justify-between">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={newChat}>
                                <MessageSquareText className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{chrome.i18n.getMessage("newChat")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='ghost' size='sm' onClick={quickOpenAiChats}>
                                <MessageSquareShare className='h-5 w-5'/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{chrome.i18n.getMessage("quicklyOpenChatWebsite")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={closeAllOpenAiChat}>
                                <MessageSquareX className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{chrome.i18n.getMessage("closeAllChatWebsites")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setMenu('add-custom-ai-chat')}>
                                <MessageSquarePlus className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{chrome.i18n.getMessage("addCurrentPageAsAIChatWebsite")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={openOptionsPage}>
                                <Settings className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{chrome.i18n.getMessage("settings")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default Main;
