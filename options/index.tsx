// @ts-ignore
import iconSrc from '@/assets/icon.png';
import About from '@/options/about';
import AiChat from '@/options/ai-chat';
import '@/styles/globals.css';
import { useState } from 'react';


function Index() {
    const menus = [
        {id: 'ai-chat', name: chrome.i18n.getMessage("settings")},
        {id: 'about', name: chrome.i18n.getMessage("about")},
    ];
    const [activeMenu, setActiveMenu] = useState('ai-chat');

    const renderMenu = () => {
        switch (activeMenu) {
            case 'ai-chat': return <AiChat />;
            case 'about': return <About />;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className='mx-auto flex items-center w-full max-w-4xl gap-2'>
                    <img src={iconSrc} alt='Logo' className='w-8 h-8'/>
                    <h1 className='text-2xl font-semibold'>{chrome.i18n.getMessage('extensionName')}</h1>
                </div>
            </header>
            <main
                className='flex flex-1 flex-col gap-4 bg-muted/40 p-4'>
                <div className="mx-auto grid w-full max-w-4xl items-start gap-6 grid-cols-[60px_1fr]">
                    <nav className="grid gap-4 text-sm text-muted-foreground">
                        {menus.map(({id, name}) => (
                            <a
                                key={id}
                                className={activeMenu === id ? 'font-semibold text-primary cursor-pointer' : 'cursor-pointer'}
                                onClick={() => setActiveMenu(id)}
                            >{name}</a>
                        ))}
                    </nav>
                    <div className='grid gap-6 '>
                        {renderMenu()}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index
