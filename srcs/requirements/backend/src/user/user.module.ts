import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { dbUserModule } from 'src/dbUser/dbUser.module';

@Module({
  imports: [forwardRef(() => dbUserModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
  ],
})
export class UserModule {}