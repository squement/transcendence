export interface Message {
    time_stamp: Date;
    sender_id: string;
    message: string;
}

// Ringbuffer: last X messages, chao bye bye to oldest when full
export class Chat {
    public id: string;
    private buffer: Message[] = [];
    private readonly MAX = 10;

    constructor() {
        this.id = crypto.randomUUID();
    }

    add(msg: Message) {
        if (this.buffer.length >= this.MAX)
            this.buffer.shift();
        this.buffer.push(msg);
    }

    search(sender_id: string): Message[] {
        return this.buffer.filter(m => m.sender_id === sender_id);
    }

    display(): Message[] {
        return [...this.buffer];
    }
}
