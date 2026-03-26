import { useQuery } from "@tanstack/react-query";
import { MapPin, CalendarDays, Image, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const [exp, eventos, banners, msgs] = await Promise.all([
        supabase.from("experiencias").select("id", { count: "exact", head: true }),
        supabase.from("eventos").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("contato_mensagens").select("id", { count: "exact", head: true }),
      ]);
      return {
        experiencias: exp.count ?? 0,
        eventos: eventos.count ?? 0,
        banners: banners.count ?? 0,
        mensagens: msgs.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Experiências", value: counts?.experiencias ?? "—", icon: MapPin, color: "text-blue-600 bg-blue-50" },
    { label: "Eventos", value: counts?.eventos ?? "—", icon: CalendarDays, color: "text-green-600 bg-green-50" },
    { label: "Banners", value: counts?.banners ?? "—", icon: Image, color: "text-purple-600 bg-purple-50" },
    { label: "Mensagens", value: counts?.mensagens ?? "—", icon: MessageSquare, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Visão geral do portal Descubra Juiz de Fora
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
