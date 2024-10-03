import AbstractAiChat from '@/ai/abstract-ai-chat';
import type { AiChat } from '@/ai/ai-chat';
import { isEmpty } from '@/common/functions';

abstract class InputElementAiChat extends AbstractAiChat implements AiChat {
    hasRelatedQuestions(): boolean {
        return false;
    }

    queryRelatedQuestionsElement(): HTMLElement | null {
        return null;
    }

    input(text: string): void {
        this.inputTextToInput(text);
    }
}

export default InputElementAiChat;
