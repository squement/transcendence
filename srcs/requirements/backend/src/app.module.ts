import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './services/socket.module';

@Module({
  imports: [
	PrismaModule,
	GroupModule,
	UserModule,
	SocketModule,
	JwtModule.register({
		global:true,
		secret: "super_cool_secret_to_change_absolutely_pls",
		signOptions: {expiresIn: '7d'},
		}),
	AuthModule,
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
