import { TitleText } from "#/components/title-text";
import { SongFormCard } from "./song-form-card.temp";
import { SongTable } from "./song-table.temp";

export default function SongsAdmin() {
  return (
    <div className="w-full space-y-6">
      <div>
        <TitleText>Songs</TitleText>
        <p className="text-sm text-muted-foreground">
          Manage songs that represent your current mood, taste, or portfolio
          personality.
        </p>
      </div>

      <SongFormCard />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Song List</h2>
          <p className="text-sm text-muted-foreground">
            Preview your saved song entries before connecting the database.
          </p>
        </div>

        <SongTable />
      </div>
    </div>
  );
}
