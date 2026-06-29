import { TitleText } from "#/components/title-text";
import { MovieFormCard } from "./movie-form-card";
import { MovieTable } from "./movie-table.";

type MoviesPageProps = {
  movies?: Array<{
    id: string;
    name: string;
    type: string;
    image: string | null;
    link: string | null;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export default function MoviesAdmin({ movies }: MoviesPageProps) {
  const movieData = movies ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div>
        <TitleText>Movies</TitleText>
        <p className="text-sm text-muted-foreground">
          Manage your favorite movies, series, and documentaries.
        </p>
      </div>
      <MovieFormCard />
      <MovieTable data={movieData} />
    </section>
  );
}
