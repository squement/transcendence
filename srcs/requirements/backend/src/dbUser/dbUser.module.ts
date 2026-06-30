import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { dbUserService } from "./dbUser.service";
import { dbUserController } from "./dbUser.controller";

@Module({
	imports: [forwardRef(() => UserModule)],
	controllers: [dbUserController],
	providers: [dbUserService],
	exports: [dbUserService],
})
export class dbUserModule {}
