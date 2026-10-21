import { useIsChatAdmin } from "@/lib/room-session";

/** Ciliz header: the table ID chip (chat:room_title label + room number) is admin-only. */
export function TableIdChip({ roomId, label, name, personal = false }: { roomId: number; label: string; name?: string | undefined; personal?: boolean }) {
  const isAdmin = useIsChatAdmin();
  if (!isAdmin && !personal) return null;
  return <div className="original-header-table" aria-label={`Masa ${roomId}`}>
    <span className="original-header-table-label">{label}</span>
    <span className="original-header-table-id">{name ? (name.length > 12 ? `${name.slice(0,11)}…` : name) : roomId}</span>
  </div>;
}
