import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventsGateway } from './services/events.gateway';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './services/socket.module';

@Module({
  imports: [
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
