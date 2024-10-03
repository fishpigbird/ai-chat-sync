import type { AiChat } from '@/ai/ai-chat';
import AiChatFactory from '@/ai/ai-chat-factory';
import { parse } from '@/common/url-match';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AiChatSettingStorage from '@/storage/ai-chat-setting-storage';
import CustomAiChatStorage from '@/storage/custom-ai-chat-storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(1, {
        message: chrome.i18n.getMessage("websiteNameRequired"),
    }),
    url: z.string().url(chrome.i18n.getMessage("incorrectWebsiteURL")).min(1, {
        message: chrome.i18n.getMessage("websiteURLRequired"),
    }),
    matches: z.string().min(1, {
        message: chrome.i18n.getMessage("websiteMatchingURLRequired"),
    }).refine((val) => parse(val), {
        message: chrome.i18n.getMessage("errorWebsiteMatchingURL"),
    }),
    inputSelector: z.string().min(1, {
        message: chrome.i18n.getMessage("aiChatBoxInputSelectorRequired"),
    }),
    sendButtonSelector: z.string().min(1, {
        message: chrome.i18n.getMessage("aiChatBoxSendButtonSelectorRequired"),
    }),
    sendKeys: z.enum(["Enter", "Ctrl/Cmd+Enter"]),
    icon: z.any(),
    chatInputRuleType: z.any(),
    chatInputRule: z.any(),
})

const customAiChatStorage = CustomAiChatStorage.getInstance();
const aiChatSettingStorage = AiChatSettingStorage.getInstance();

function AddCustomAiChat({ setMenu }) {
    const { toast } = useToast();
    const [aiChats, setAiChats] = useState<AiChat[]>([]);

    useEffect(() => {
        const getAllAiChats = async () => {
            const aiChats = await AiChatFactory.getAllAiChats();
            setAiChats(aiChats);
            form.setValue('chatInputRule', aiChats[0].id);
        }
        getAllAiChats();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            icon: "",
            url: "",
            matches: "",
            inputSelector: "textarea",
            sendButtonSelector: "button",
            sendKeys: "Enter",
            chatInputRuleType: "custom",
        },
    })
    const watchUrl = form.watch("url");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const customAiChat = await customAiChatStorage.saveCustomAiChat({
            name: values.name,
            icon: values.icon,
            url: values.url,
            matches: values.matches,
            inputSelector: values.inputSelector,
            sendButtonSelector: values.sendButtonSelector,
            sendKeys: values.sendKeys,
            chatInputRuleType: values.chatInputRuleType,
            chatInputRule: values.chatInputRule,
        });
        await aiChatSettingStorage.addSyncInputAiChat(customAiChat.id);
        await aiChatSettingStorage.addQuickOpenAiChat(customAiChat.id);
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tabs.length > 0) {
            await chrome.tabs.reload(tabs[0].id);
        }

        window.close();
    }

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                const url = activeTab.url.endsWith("/") ? activeTab.url.slice(0, -1) : activeTab.url;
                form.setValue('name', activeTab.title);
                form.setValue('icon', activeTab.favIconUrl);
                form.setValue('url', url);
                form.setValue('matches', url.replace(/^(http|https):\/\//, '*://')+ '/*');
            }
        });

    }, []);

    useEffect(() => {
        if (watchUrl) {
            customAiChatStorage.getCustomAiChatByUrl(watchUrl).then((customAiChat) => {
                if (customAiChat) {
                    //console.log(customAiChat)
                    form.setValue('matches', customAiChat.matches);
                    form.setValue('chatInputRuleType', customAiChat.chatInputRuleType);
                    form.setValue('chatInputRule', customAiChat.chatInputRule);
                    form.setValue('inputSelector', customAiChat.inputSelector);
                    form.setValue('sendButtonSelector', customAiChat.sendButtonSelector);
                    form.setValue('sendKeys', customAiChat.sendKeys);
                }
            });
        }
    }, [watchUrl]);

    return (
        <div className="w-[300px] p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <FormItem className={'space-y-1'}>
                                <FormLabel>{chrome.i18n.getMessage("websiteName")}</FormLabel>
                                <FormControl>
                                    <Input className="h-7" placeholder='' {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='url'
                        render={({field}) => (
                            <FormItem className={'space-y-1'}>
                                <FormLabel>{chrome.i18n.getMessage("websiteURL")}</FormLabel>
                                <FormControl>
                                    <Input className="h-7" placeholder='' {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='matches'
                        render={({field}) => (
                            <FormItem className={'space-y-1'}>
                                <FormLabel>{chrome.i18n.getMessage("websiteMatchingURL")}</FormLabel>
                                <FormControl>
                                    <Input className="h-7" placeholder='' {...field} />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    {chrome.i18n.getMessage("websiteMatchingURLDesc")}
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='chatInputRuleType'
                        render={({field}) => (
                            <FormItem className={'space-y-1'}>
                                <FormControl>
                                    <RadioGroup className={"flex flex-row"} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="custom" id="r1" />
                                            <Label htmlFor="r1">{chrome.i18n.getMessage("customChatBoxRules")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="exist" id="r2" />
                                            <Label htmlFor="r2">{chrome.i18n.getMessage("existingWebsiteRules")}</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {form.watch('chatInputRuleType') === "custom" && (
                        <>
                            <FormField
                                control={form.control}
                                name='inputSelector'
                                render={({field}) => (
                                    <FormItem className={'space-y-1'}>
                                        <FormLabel>{chrome.i18n.getMessage("chatBoxSelector")}</FormLabel>
                                        <FormControl>
                                            <Input className="h-7" placeholder='' {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {chrome.i18n.getMessage("chatBoxSelectorDesc")}
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='sendButtonSelector'
                                render={({field}) => (
                                    <FormItem className={'space-y-1'}>
                                        <FormLabel>{chrome.i18n.getMessage("chatBoxSendButtonSelector")}</FormLabel>
                                        <FormControl>
                                            <Input className="h-7" placeholder='' {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {chrome.i18n.getMessage("chatBoxSendButtonSelectorDesc")}
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='sendKeys'
                                render={({field}) => (
                                    <FormItem className={'space-y-1'}>
                                        <FormLabel>{chrome.i18n.getMessage("chatBoxSendsKeyboardKeys")}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-7">
                                                    <SelectValue placeholder={chrome.i18n.getMessage("selectChatBoxToSendKeyboardKeys")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={"Enter"}>Enter</SelectItem>
                                                <SelectItem value={"Ctrl/Cmd+Enter"}>Ctrl/Cmd+Enter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {form.watch('chatInputRuleType') === "exist" && (
                        <FormField
                            control={form.control}
                            name='chatInputRule'
                            render={({field}) => (
                                <FormItem className={'space-y-1'}>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-7">
                                                <SelectValue placeholder={chrome.i18n.getMessage("selectExistingAIChatWebsiteConfiguration")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-40 overflow-auto">
                                            {aiChats.map((aiChat) => (
                                                <SelectItem key={aiChat.id} value={aiChat.id}>{aiChat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name='icon'
                        render={({field}) => (
                            <input type={'hidden'} />
                        )}
                    />
                    <div className='items-center gap-2 ml-auto flex justify-center'>
                        <Button type='button' variant="outline" size="sm" className={'h-7'} onClick={() => setMenu('main')}>{chrome.i18n.getMessage("cancel")}</Button>
                        <Button type='submit' size="sm" className={'h-7'}>{chrome.i18n.getMessage("submit")}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddCustomAiChat;
