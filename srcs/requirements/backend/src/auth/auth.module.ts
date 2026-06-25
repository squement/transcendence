import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { dbUserModule } from 'src/dbUser/dbUser.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [dbUserModule]
})
export class AuthModule {}
