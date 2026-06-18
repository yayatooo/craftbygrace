import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  Save,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";

export function ExperienceFormCard() {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BriefcaseBusiness className="size-5" />
              Add Experience
            </CardTitle>
            <CardDescription>
              Add your work history, freelance work, or professional path.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Switch id="experience-current" />
            <Label htmlFor="experience-current" className="text-sm">
              Current
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-company">Company Name</Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="experience-company"
                  name="companyName"
                  placeholder="Evindo Global Putra"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-role">Role</Label>
              <div className="relative">
                <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="experience-role"
                  name="role"
                  placeholder="Full Stack Developer"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-start-date">Start Date</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="experience-start-date"
                  name="startDate"
                  type="date"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-end-date">End Date</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="experience-end-date"
                  name="endDate"
                  type="date"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty if this is your current role.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-type-job">Job Type</Label>
              <Select defaultValue="full_time">
                <SelectTrigger id="experience-type-job" name="typeJob">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="self_employed">Self-employed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-location">Location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="experience-location"
                  name="location"
                  placeholder="Jakarta, Indonesia"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-order">Order</Label>
            <Input
              id="experience-order"
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
              Save Experience
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
