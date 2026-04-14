interface Event {
  id: string;
  type: string;
  page: string;
  action: string | null;
  timestamp: string | Date;
}

interface RecentEventsTableProps {
  events: Event[];
}

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    PAGE_VIEW: "👁️",
    CREATE_BAND: "➕",
    UPDATE_BAND: "✏️",
    DELETE_BAND: "🗑️",
    CREATE_TRACK: "➕",
    UPDATE_TRACK: "✏️",
    DELETE_TRACK: "🗑️",
    ERROR: "❌",
  };
  return icons[type] || "📌";
}

function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return d.toLocaleDateString("pt-BR");
}

export function RecentEventsTable({ events }: RecentEventsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">📋 Eventos Recentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Página
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Ação
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Horário
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr
                  key={event.id || index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getEventIcon(event.type)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {event.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {event.page}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {event.action || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(event.timestamp)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Nenhum evento registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
