import { Upload } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export function UploadGalleryCard() {
  return (
    <Card className="w-full rounded-3xl border-border/80 shadow-none">
      <CardHeader className="space-y-1 px-6 py-3">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Upload camera roll
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Drag and drop photos to add them into your portfolio gallery.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Album Name</Label>
            <Input
              placeholder="Camera Roll"
              className="h-11 rounded-xl text-sm shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <select className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <option value="public">Public Gallery</option>
              <option value="private">Private Draft</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        <label
          htmlFor="camera-roll-upload"
          className="flex min-h-45 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center transition-colors hover:bg-muted/40"
        >
          <Input
            id="camera-roll-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
          />

          <Upload className="mb-4 size-8 stroke-[1.8]" />

          <p className="text-base font-semibold">
            Drag & Drop or Choose file to upload
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Max 12 files · Up to 5MB each
          </p>
        </label>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 px-6 pb-6 pt-2">
        <Button type="button" variant="outline" className="h-11 px-6 text-sm">
          Cancel
        </Button>

        <Button type="button" className="h-11 px-6 text-sm">
          Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
