import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('new')
    createChat() {
        return this.chatService.new();
    }

    @Get(':id')
    getMessages(@Param('id') id: string) {
        return this.chatService.display(id);
    }

    @Post(':id')
    postMessage(
        @Param('id') id: string,
        @Body() body: { sender_id: string; message: string }
    ) {
        return this.chatService.post(id, body);
    }
}
