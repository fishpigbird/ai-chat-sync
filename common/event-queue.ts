
type Callback = () => Promise<void>;

class EventQueue {
    private queue: Callback[] = [];
    private isProcessing = false;

    push(callback: Callback) {
        this.queue.push(callback);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const callback = this.queue.shift();
            try {
                await callback();
            }
            catch (e) {
                console.error(e);
            }
        }

        this.isProcessing = false;
    }
}

export default EventQueue;
