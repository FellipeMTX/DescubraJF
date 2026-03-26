import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import {
  useExperiences,
  useExperienceCategories,
} from "@/hooks/useExperiences";

export default function ExperienceList() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const { data: categories, isLoading: loadingCats } =
    useExperienceCategories();
  const { data: experiences, isLoading: loadingExps } =
    useExperiences(selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Experiências</h1>
      <p className="mt-2 text-gray-600">Explore o melhor de Juiz de Fora</p>

      {/* Category filter */}
      <div className="mt-8">
        {loadingCats ? (
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        ) : categories ? (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        ) : null}
      </div>

      {/* Experience grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadingExps
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-56 rounded-lg" />
                <Skeleton className="mt-3 h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            ))
          : experiences?.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
      </div>

      {!loadingExps && !experiences?.length && (
        <p className="mt-12 text-center text-gray-500">
          Nenhuma experiência encontrada nesta categoria.
        </p>
      )}
    </div>
  );
}
