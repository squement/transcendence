import { Module } from "@nestjs/common";
import { dbUserService } from "./dbUser.service";
import { dbUserController } from "./dbUser.controller";

@Module({
	controllers: [dbUserController],
	providers: [dbUserService],
	exports: [dbUserService],
})
export class dbUserModule {}
