import { useIsChatAdmin } from "@/lib/room-session";

/** Ciliz header: the table ID chip (chat:room_title label + room number) is admin-only. */
export function TableIdChip({ roomId, label }: { roomId: number; label: string }) {
  const isAdmin = useIsChatAdmin();
  if (!isAdmin) return null;
  return <div className="original-header-table" aria-label={`Masa ${roomId}`}>
    <span className="original-header-table-label">{label}</span>
    <span className="original-header-table-id">{roomId}</span>
  </div>;
}
