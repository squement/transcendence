import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsGateway } from './events.gateway';
import { GameGateway } from './game.gateway';
import { UserModule } from '../user/user.module';

// GroupModule est importé parce que RoomService dépend de GroupService.
// GroupModule exporte GroupService, ce qui le rend disponible dans ce module.
import { GroupModule } from '../group/group.module';

// RoomService : on le déclare comme provider ici pour que NestJS puisse
// l'injecter dans GameGateway via son constructeur.
import { RoomService } from '../room/room.service';

// GameService : injecté dans RoomService pour sauvegarder les parties en DB.
import { GameService } from '../game/game.service';

@Module({
    // imports : les modules dont on a besoin dans ce module.
    // UserModule : déjà là, utilisé par EventsGateway.
    // GroupModule : nécessaire pour que RoomService puisse utiliser GroupService.
    imports: [UserModule, GroupModule],

    // providers : les classes instanciées et gérées par NestJS dans ce module.
    // GameGateway reçoit RoomService par injection de dépendances.
    // RoomService reçoit GroupService (fourni par GroupModule) par injection de dépendances.
    providers: [
        EventsGateway,
        GameGateway,
        NotificationsGateway,
        RoomService,
        GameService,
    ],
})
export class SocketModule {}
