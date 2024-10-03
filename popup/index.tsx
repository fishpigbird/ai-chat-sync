import AddCustomAiChat from '@/popup/add-custom-ai-chat';
import Main from '@/popup/main';
import '@/styles/globals.css';
import { useState } from 'react';

function Index() {
    const [menu, setMenu] = useState('main');

    if (menu === 'main') {
        return <Main setMenu={setMenu} />;
    }
    else if (menu === 'add-custom-ai-chat') {
        return <AddCustomAiChat setMenu={setMenu} />;
    }
    else {
        return null;
    }
}

export default Index;
