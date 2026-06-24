import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    // Persiste le résultat d'une partie terminée.
    // player1Id / player2Id sont optionnels : null si le joueur n'était pas authentifié.
    // winnerId : l'id du joueur avec le plus grand score (null si égalité ou joueurs anonymes).
    async save(
        score1: number,
        score2: number,
        player1Id: number | null,
        player2Id: number | null,
    ): Promise<void> {
        const winnerId = score1 > score2 ? player1Id
                       : score2 > score1 ? player2Id
                       : null;
        await this.prisma.game.create({
            data: {
                endedAt: new Date(),
                score1,
                score2,
                player1Id: player1Id ?? undefined,
                player2Id: player2Id ?? undefined,
                winnerId:  winnerId  ?? undefined,
            },
        });
    }
}
