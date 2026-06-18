import { TitleText } from "#/components/title-text";
import { MovieFormCard } from "./movie-form-card.temp";
import { MovieTable } from "./movie-table.temp";

export default function MoviesAdmin() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <TitleText>Movies</TitleText>
        <p className="text-sm text-muted-foreground">
          Manage your favorite movies, series, and documentaries.
        </p>
      </div>
      <MovieFormCard />
      <MovieTable />
    </section>
  );
}
