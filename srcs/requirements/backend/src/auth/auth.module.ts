import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { dbUserModule } from 'src/dbUser/dbUser.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [dbUserModule , UserModule]
})
export class AuthModule {}
