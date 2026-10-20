/** A delayed/playing entrance belongs to a room, renderer and occupant—not a reusable seat. */
export function entryParticipantCurrent(
  expected: { roomId: number | null; table: unknown; playerId: string },
  current: { roomId: number | null; table: unknown; playerId: string | undefined },
) {
  return expected.roomId !== null && expected.roomId === current.roomId
    && expected.table === current.table && expected.playerId === current.playerId;
}