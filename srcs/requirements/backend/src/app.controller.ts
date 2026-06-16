import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('greet/:name')
  greetUser(@Param('name') name: string): string {
    return `Hello, ${name} !`;
  }

  @Get('config')
  getConfig() {
    return this.appService.getConfig();
  }

  @Post('increment-back')
  incrementBack() {
    return this.appService.incrementBack();
  }
}