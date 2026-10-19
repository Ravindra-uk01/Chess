import { db } from '../db';

/**
 * Removes guest users that have been inactive for more than `olderThanHours`.
 * Safe against foreign key constraints by removing moves and games linked to these guests.
 * Does not remove guests currently playing in an active ('IN_PROGRESS') game.
 *
 * @param olderThanHours - Threshold in hours after which an inactive guest is considered stale (default: 24)
 */
export async function cleanupInactiveGuestUsers(olderThanHours: number = 24) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

  // 1. Find all stale guest users who are NOT currently in an active game
  const inactiveGuests = await db.user.findMany({
    where: {
      provider: 'GUEST',
      createdAt: { lt: cutoff },
      gameAsWhite: {
        none: {
          status: 'IN_PROGRESS',
        },
      },
      gameAsBlack: {
        none: {
          status: 'IN_PROGRESS',
        },
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (inactiveGuests.length === 0) {
    console.log('[Cron Job] No stale guest users found for cleanup.');
    return { deletedGuests: 0, deletedGames: 0 };
  }

  const guestIds = inactiveGuests.map((g) => g.id);

  // 2. Find any finished/abandoned games involving these guest users
  const associatedGames = await db.game.findMany({
    where: {
      OR: [
        { whitePlayerId: { in: guestIds } },
        { blackPlayerId: { in: guestIds } },
      ],
    },
    select: {
      id: true,
    },
  });

  const gameIds = associatedGames.map((g) => g.id);

  // 3. Atomically delete moves, games, and guest users
  const deletedCount = await db.$transaction(async (tx) => {
    if (gameIds.length > 0) {
      await tx.move.deleteMany({
        where: { gameId: { in: gameIds } },
      });
      await tx.game.deleteMany({
        where: { id: { in: gameIds } },
      });
    }

    const { count } = await tx.user.deleteMany({
      where: { id: { in: guestIds } },
    });

    return count;
  });

  console.log(
    `[Cron Job] Cleaned up ${deletedCount} inactive guest user(s) and ${gameIds.length} associated game(s) older than ${olderThanHours}h.`
  );

  return {
    deletedGuests: deletedCount,
    deletedGames: gameIds.length,
  };
}
