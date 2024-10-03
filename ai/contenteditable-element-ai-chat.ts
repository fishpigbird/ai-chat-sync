import AbstractAiChat from '@/ai/abstract-ai-chat';
import type { AiChat } from '@/ai/ai-chat';
import { isEmpty } from '@/common/functions';

abstract class ContenteditableElementAiChat extends AbstractAiChat implements AiChat {
    hasRelatedQuestions(): boolean {
        return false;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return null;
    }

    input(text: string): void {
        this.pasteTextToInput(text);

        // inputElement.focus();
        //inputElement.innerHTML = text;
    }
}

export default ContenteditableElementAiChat;
