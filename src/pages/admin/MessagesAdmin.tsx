import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { ContatoMensagem } from "@/types/database";

export default function MessagesAdmin() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin", "mensagens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contato_mensagens")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContatoMensagem[];
    },
  });

  async function markAsRead(id: string) {
    await supabase.from("contato_mensagens").update({ lida: true }).eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["admin", "mensagens"] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
      <p className="text-sm text-gray-500">
        Mensagens recebidas pelo formulário de contato
      </p>

      <div className="mt-6 space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : messages?.length === 0
            ? (
                <p className="py-12 text-center text-gray-500">
                  Nenhuma mensagem recebida ainda.
                </p>
              )
            : messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg border bg-white p-4 ${!msg.lida ? "border-primary-200 bg-primary-50/30" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {msg.lida ? (
                        <MailOpen size={16} className="text-gray-400" />
                      ) : (
                        <Mail size={16} className="text-primary-600" />
                      )}
                      <span className="font-medium text-gray-900">{msg.nome}</span>
                      <span className="text-sm text-gray-500">&lt;{msg.email}&gt;</span>
                      {!msg.lida && <Badge className="bg-primary-500 text-white">Nova</Badge>}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  {msg.assunto && (
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {msg.assunto}
                    </p>
                  )}
                  <p className="mt-1 text-sm whitespace-pre-line text-gray-600">{msg.mensagem}</p>

                  {!msg.lida && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => markAsRead(msg.id)}
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              ))}
      </div>
    </div>
  );
}
