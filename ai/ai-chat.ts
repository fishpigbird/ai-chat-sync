interface AiChat {
    id: string;
    name: string;
    icon: string;
    url: string;
    matches: string[];
    active: boolean;
    isLoaded(): boolean,
    bindSyncEvent(send: (text: string) => void): void;
    input(text: string): void;
    send(text: string): void;
    newChat(): void;
}

export type { AiChat }
