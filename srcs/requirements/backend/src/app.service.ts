import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getConfig() {
    return this.prisma.testConfig.findFirst();
  }

  async incrementBack() {
    const config = await this.prisma.testConfig.findFirst();
    if (!config) {
      return this.prisma.testConfig.create({ data: { back: 1, front: 0 } });
    }
    return this.prisma.testConfig.update({
      where: { id: config.id },
      data: { back: config.back + 1 },
    });
  }
}