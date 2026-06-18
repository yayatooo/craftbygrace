import { ImageIcon, LinkIcon, Music2, Save } from "lucide-react";

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

export function SongFormCard() {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Music2 className="size-5" />
              Add Song
            </CardTitle>
            <CardDescription>
              Add your favorite songs to show on your portfolio.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Switch id="song-active" defaultChecked />
            <Label htmlFor="song-active" className="text-sm">
              Active
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="song-name">Song Name</Label>
              <Input
                id="song-name"
                name="name"
                placeholder="Sweet Disposition"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="song-writer">Writer / Artist</Label>
              <Input
                id="song-writer"
                name="writer"
                placeholder="The Temper Trap"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="song-image">Image URL</Label>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="song-image"
                name="image"
                placeholder="https://i.scdn.co/image/..."
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use album cover URL or uploaded image path.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="song-link">Song Link</Label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="song-link"
                name="link"
                placeholder="https://open.spotify.com/track/..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="song-order">Order</Label>
            <Input
              id="song-order"
              name="order"
              type="number"
              min={0}
              defaultValue={0}
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button type="button" variant="outline">
              Cancel
            </Button>

            <Button type="button">
              <Save className="size-4" />
              Save Song
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
