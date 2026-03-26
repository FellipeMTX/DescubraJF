import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import type { Experiencia } from "@/types/database";

type ExperienceCardProps = {
  experience: Experiencia;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link
      to={`/experiencias/${experience.slug}`}
      className="group block overflow-hidden rounded-lg"
    >
      <div className="relative h-56 bg-gray-200">
        {experience.imagem_destaque ? (
          <img
            src={experience.imagem_destaque}
            alt={experience.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-50 text-sm text-primary-400">
            {experience.nome}
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

        {/* Category badge */}
        {experience.categoria && (
          <Badge
            className="absolute left-3 top-3 text-white"
            style={{ backgroundColor: experience.categoria.cor ?? "#7b9669" }}
          >
            {experience.categoria.nome}
          </Badge>
        )}

        {/* Free badge */}
        {experience.gratuito && (
          <Badge className="absolute right-3 top-3 bg-green-500 text-white">
            Gratuito
          </Badge>
        )}
      </div>

      <div className="bg-white p-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
          {experience.nome}
        </h3>
        {experience.descricao_curta && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {experience.descricao_curta}
          </p>
        )}
      </div>
    </Link>
  );
}
