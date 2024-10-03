import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function About() {
    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle>{chrome.i18n.getMessage('about')}</CardTitle>
                <CardDescription>
                    {chrome.i18n.getMessage('aboutDesc')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='text-sm space-y-2'>
                    <div>
                        <span className='w-[80] inline-block'>Github：</span>
                        <a target='_blank'
                           href={'https://github.com/legendjw/ai-chat-sync'}>https://github.com/legendjw/ai-chat-sync</a>
                    </div>
                    <div>
                        <span className='w-[80] inline-block'>{chrome.i18n.getMessage('problemFeedback')}：</span>
                        <a target='_blank'
                           href={'https://github.com/legendjw/ai-chat-sync/issues'}>https://github.com/legendjw/ai-chat-sync/issues</a>
                    </div>
                    <div>
                        <span className='w-[80] inline-block'>{chrome.i18n.getMessage('email')}：</span>
                        <a href={'mailto:legendjww@gmail.com'}>legendjww@gmail.com</a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default About
