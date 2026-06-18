import { FolderGit2, ImageIcon, LinkIcon, Save } from "lucide-react";

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

export function ProjectFormCard() {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FolderGit2 className="size-5" />
              Add Project
            </CardTitle>
            <CardDescription>
              Add portfolio projects, case studies, or private NDA work.
            </CardDescription>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Switch id="project-active" defaultChecked />
              <Label htmlFor="project-active" className="text-sm">
                Active
              </Label>
            </div>

            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Switch id="project-current" />
              <Label htmlFor="project-current" className="text-sm">
                Current
              </Label>
            </div>

            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Switch id="project-secret" />
              <Label htmlFor="project-secret" className="text-sm">
                Secret
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" name="name" placeholder="Tuwucook AI" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input id="project-slug" name="slug" placeholder="tuwucook-ai" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              name="description"
              placeholder="AI cooking assistant that helps users generate recipes based on their kitchen ingredients."
              className="min-h-28 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-thumbnail">Thumbnail URL</Label>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="project-thumbnail"
                name="thumbnail"
                placeholder="https://res.cloudinary.com/project-thumbnail.png"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-tech-stack">Tech Stack</Label>
            <Input
              id="project-tech-stack"
              name="techStack"
              placeholder="Next.js, Drizzle, PostgreSQL, Tailwind"
            />
            <p className="text-xs text-muted-foreground">
              Static input for now. Later we can split by comma into string
              array.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-demo-link">Demo Link</Label>
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="project-demo-link"
                  name="demoLink"
                  placeholder="https://tuwucook.ai"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-repo-link">Repo Link</Label>
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="project-repo-link"
                  name="repoLink"
                  placeholder="https://github.com/yayatooo/tuwucook"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-order">Order</Label>
            <Input
              id="project-order"
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
              Save Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
