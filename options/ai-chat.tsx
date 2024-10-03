import AiChatFactory from '@/ai/ai-chat-factory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiChatSettingStorage from '@/storage/ai-chat-setting-storage';
import CustomAiChatStorage, { type CustomAiChatSite } from '@/storage/custom-ai-chat-storage';
import { useStorage } from '@plasmohq/storage/dist/hook';
import { Trash2 } from 'lucide-react';

const aiChatSettingStorage = AiChatSettingStorage.getInstance();
const customAiChatStorage = CustomAiChatStorage.getInstance();

function AiChat() {
    const systemAiChats = AiChatFactory.systemAiChats;
    const [customAiChats] = useStorage<CustomAiChatSite[]>
    ({key: customAiChatStorage.storageKey, instance: customAiChatStorage.storage}, [])
    const [syncInputAiChats, setSyncInputAiChats] = useStorage<string[]>
    ({key: aiChatSettingStorage.syncInputAiChatStorageKey, instance: aiChatSettingStorage.storage}, [])
    const [quickOpenAiChats, setQuickOpenAiChats] = useStorage<string[]>
    ({key: aiChatSettingStorage.quickOpenAiChatStorageKey, instance: aiChatSettingStorage.storage}, [])
    const [quickOpenMethod, setQuickOpenMethod] = useStorage<string>
    ({key: aiChatSettingStorage.quickOpenMethodStorageKey, instance: aiChatSettingStorage.storage}, 'tab')

    //aiChatSettingStorage.storage.getAll().then(v => console.log('aichatsetting', v))
    //customAiChatStorage.storage.getAll().then(v => console.log('customaichat', v))


    const toggleInputSync = async (aiChatId: string, checked: boolean) => {
        if (checked) {
            await aiChatSettingStorage.addSyncInputAiChat(aiChatId);
        }
        else {
            await aiChatSettingStorage.removeSyncInputAiChat(aiChatId);
        }
    }

    const toggleQuickOpen = async (aiChatId: string, checked: boolean) => {
        if (checked) {
            await aiChatSettingStorage.addQuickOpenAiChat(aiChatId);
        }
        else {
            await aiChatSettingStorage.removeQuickOpenAiChat(aiChatId);
        }
    }

    const removeCustomAiChat = async (aiChatId: string) => {
        await customAiChatStorage.removeCustomAiChatById(aiChatId);
    }

    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle>{chrome.i18n.getMessage('settings')}</CardTitle>
                <CardDescription className="space-y-1 pt-2">
                    <div className='flex'>
                        <span>{chrome.i18n.getMessage('quickOpenWebsiteMethod')}：</span>
                        <RadioGroup className={'flex flex-row'} onValueChange={(value) => setQuickOpenMethod(value)} value={quickOpenMethod}>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='tab' id='r1'/>
                                <Label htmlFor='r1'>{chrome.i18n.getMessage('tabs')}</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='newWindowTab' id='r2'/>
                                <Label htmlFor='r2'>{chrome.i18n.getMessage('newWindowTabs')}</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='windowHorizontal' id='r3'/>
                                <Label htmlFor='r3'>{chrome.i18n.getMessage('horizontalTiling')}</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='windowVertical' id='r4'/>
                                <Label htmlFor='r4'>{chrome.i18n.getMessage('verticalTiling')}</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='windowGrid' id='r5'/>
                                <Label htmlFor='r5'>{chrome.i18n.getMessage('gridTiling')}</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue='system' className=''>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="system">{chrome.i18n.getMessage('system')}</TabsTrigger>
                        <TabsTrigger value="custom">{chrome.i18n.getMessage('custom')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value='system'>
                        <div className='grid grid-cols-2 gap-4 max-h-[calc(100vh_-_270px)] overflow-y-auto'>
                            {systemAiChats.filter(ai => ai).map(ai => (
                                <Card key={ai.id} className="">
                                    <CardHeader className="py-4">
                                        <CardTitle className='flex items-center space-x-2'>
                                            <img className='w-6' src={ai.icon}/>
                                            <div className='truncate'><a target='_blank' href={ai.url}>{ai.name}</a></div>
                                        </CardTitle>
                                        <CardDescription>
                                            <div className='truncate'><a target='_blank' href={ai.url}>{ai.url}</a></div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-1 text-sm">
                                        <div className="flex flex-row items-center justify-between">
                                            <div>
                                                {chrome.i18n.getMessage('enableChatSynchronization')}
                                            </div>
                                            <Switch checked={syncInputAiChats.includes(ai.id)}
                                                    onCheckedChange={(checked) => toggleInputSync(ai.id, checked)}/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between">
                                            <div>
                                                {chrome.i18n.getMessage('addToQuickOpen')}
                                            </div>
                                            <Switch checked={quickOpenAiChats.includes(ai.id)}
                                                    onCheckedChange={(checked) => toggleQuickOpen(ai.id, checked)}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value='custom'>
                        <div className='grid grid-cols-2 gap-4 max-h-[calc(100vh_-_270px)] overflow-y-auto'>
                            {customAiChats.filter(ai => ai).map(ai => (
                                <Card key={ai.id} className=''>
                                    <CardHeader className='py-4'>
                                        <CardTitle className='flex items-center space-x-2'>
                                            <img className='w-6' src={ai.icon}/>
                                            <div className='truncate'><a target='_blank' href={ai.url}>{ai.name}</a></div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' variant='ghost'
                                                            className='!ml-auto h-6 w-6'><Trash2
                                                        size='16'/></Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-50 flex items-center'>
                                                    <div>{chrome.i18n.getMessage('deleteTip')}</div>
                                                    <div><Button size='sm' className={'h-7'}
                                                                 onClick={() => removeCustomAiChat(ai.id)}>{chrome.i18n.getMessage('confirm')}</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </CardTitle>
                                        <CardDescription>
                                            <div className='truncate'><a target='_blank' href={ai.url}>{ai.url}</a></div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='space-y-1 text-sm'>
                                        <div className='flex flex-row items-center justify-between'>
                                            <div>
                                                {chrome.i18n.getMessage('enableChatSynchronization')}
                                            </div>
                                            <Switch checked={syncInputAiChats.includes(ai.id)}
                                                    onCheckedChange={(checked) => toggleInputSync(ai.id, checked)}/>
                                        </div>
                                        <div className='flex flex-row items-center justify-between'>
                                            <div>
                                                {chrome.i18n.getMessage('addToQuickOpen')}
                                            </div>
                                            <Switch checked={quickOpenAiChats.includes(ai.id)}
                                                    onCheckedChange={(checked) => toggleQuickOpen(ai.id, checked)}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default AiChat
