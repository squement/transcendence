import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat, Message } from './chat.model';

@Injectable()
export class ChatService {
    private chats = new Map<string, Chat>();

    new(): Chat {
        const chat = new Chat();
        this.chats.set(chat.id, chat);
        return chat;
    }

    delete(id: string) {
        this.chats.delete(id);
    }

    display(id: string): Message[] {
        const chat = this.chats.get(id);
        if (!chat) throw new NotFoundException(`Chat ${id} not found`);
        return chat.display();
    }

    post(id: string, msg: Omit<Message, 'time_stamp'>): Message[] {
        const chat = this.chats.get(id);
        if (!chat) throw new NotFoundException(`Chat ${id} not found`);
        chat.add({ ...msg, time_stamp: new Date() });
        return chat.display();
    }
}
