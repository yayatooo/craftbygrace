import { Film, ImageIcon, LinkIcon, Save } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";

export function MovieFormCard() {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Film className="size-5" />
              Add Movie
            </CardTitle>
            <CardDescription>
              Add movies, series, or documentaries that you want to show on your
              portfolio.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Switch id="movie-active" defaultChecked />
            <Label htmlFor="movie-active" className="text-sm">
              Active
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="movie-name">Movie Name</Label>
              <Input id="movie-name" name="name" placeholder="Interstellar" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movie-type">Type</Label>
              <Input
                id="movie-type"
                name="type"
                placeholder="Movie, Series, Anime, Documentary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movie-image">Image URL</Label>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="movie-image"
                name="image"
                placeholder="https://image.tmdb.org/..."
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use poster image URL or uploaded image path.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movie-link">Link</Label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="movie-link"
                name="link"
                placeholder="https://letterboxd.com/..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="movie-order">Order</Label>
              <Input
                id="movie-order"
                name="order"
                type="number"
                min={0}
                defaultValue={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movie-note">Display Note</Label>
              <Input
                id="movie-note"
                placeholder="Optional short note for UI preview"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movie-preview">Preview Description</Label>
            <Textarea
              id="movie-preview"
              placeholder="Optional static description. This field is only for UI mockup and not included in schema yet."
              className="min-h-24 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button type="button" variant="outline">
              Cancel
            </Button>

            <Button type="button">
              <Save className="size-4" />
              Save Movie
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
