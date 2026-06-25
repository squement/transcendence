import { Module } from "@nestjs/common";
import { dbUserService } from "./dbUser.service";

@Module({
	providers: [dbUserService],
	exports: [dbUserService],
})
export class dbUserModule {}
