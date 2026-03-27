import { useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";

const ROUTE_DATA: Record<string, { name: string; description: string; embedUrl: string }> = {
  "caminho-das-compras": {
    name: "Caminho das Compras",
    description: "Descubra o melhor do comércio local de Juiz de Fora. Este roteiro passa pelos principais pontos de compras da cidade, desde o Mercado Municipal até as lojas do centro.",
    embedUrl: "https://www.google.com/maps/d/embed?mid=1qeNWdbKRch-yw3perAUVjn2rUFJcalef&ehbc=2E312F",
  },
  "caminho-das-cervejas-especiais": {
    name: "Caminho das Cervejas Especiais",
    description: "Rota pelas cervejarias artesanais de Juiz de Fora. Conheça os rótulos premiados e os brewpubs mais charmosos da cidade.",
    embedUrl: "https://www.google.com/maps/d/embed?mid=1yy_47YmVoy7nR9X9p43dTMemIZRv3sQ&ehbc=2E312F",
  },
  "caminho-da-gastronomia": {
    name: "Caminho da Gastronomia",
    description: "Sabores e aromas de Juiz de Fora. Um roteiro pelos restaurantes, cafés e experiências gastronômicas mais marcantes da cidade.",
    embedUrl: "https://www.google.com/maps/d/embed?mid=1vBpHKbGddCTw6VHqHrub57hPXOZt1a7I&ehbc=2E312F",
  },
  "caminho-dos-butecos": {
    name: "Caminho dos Butecos",
    description: "Os botecos mais tradicionais da cidade. Petiscos, cerveja gelada e muita história em cada esquina.",
    embedUrl: "https://www.google.com/maps/d/embed?mid=1jH6vcyHiaqnFHvmMZtEnqYOJlp7BYdOt&ehbc=2E312F",
  },
  "caminho-da-cultura": {
    name: "Caminho da Cultura",
    description: "Arte, história e patrimônio cultural. Visite museus, teatros, galerias e espaços culturais de Juiz de Fora.",
    embedUrl: "https://www.google.com/maps/d/embed?mid=1ui8WGGqUaFR_3odwa2y85s5qVm6mOVKn&ehbc=2E312F",
  },
  "caminho-das-origens": {
    name: "Caminho das Origens",
    description: "As raízes históricas de Juiz de Fora. Um percurso pelos marcos fundadores e pela memória da cidade.",
    embedUrl: "",
  },
};

export default function RouteDetail() {
  const { slug } = useParams();
  const route = slug ? ROUTE_DATA[slug] : null;

  if (!route) {
    return (
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary-800">Roteiro não encontrado</h1>
          <Link to="/roteiros" className="mt-4 inline-flex items-center gap-1 text-primary-500 hover:underline">
            <ChevronLeft size={16} /> Voltar para Roteiros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/roteiros" className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-primary-600">
          <ChevronLeft size={16} /> Roteiros
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-primary-800">{route.name}</h1>
        <p className="mt-2 text-accent-500">{route.description}</p>

        {route.embedUrl ? (
          <div className="mt-6 overflow-hidden rounded-xl shadow-lg">
            <iframe
              src={route.embedUrl}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={route.name}
            />
          </div>
        ) : (
          <div className="mt-6 flex h-96 items-center justify-center rounded-xl bg-primary-100 text-primary-400">
            Mapa em breve
          </div>
        )}
      </div>
    </div>
  );
}
