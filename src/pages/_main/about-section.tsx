import { MoveRight } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { albums, galleryItems, movies, stack } from "./components/data";
import { ShowcaseSection } from "./components/showcase-section";

export const AboutSection = () => {
  return (
    <section className="flex flex-col gap-4 py-4">
      <div>
        <h1 className="text-base font-semibold sm:text-lg">Current Stack</h1>
        <p className="text-muted-foreground">
          The engine behind my work. I leverage this trusted stack to deliver
          robust and scalable solutions for both my clients and my team.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...stack]
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <Badge
                key={item.src}
                variant="outline"
                className="h-8 gap-2 rounded-md bg-border px-3 text-sm"
              >
                <img
                  src={item.src}
                  alt=""
                  className="size-4 shrink-0 object-contain"
                  loading="lazy"
                />
                {item.title}
              </Badge>
            ))}
        </div>
      </div>
      <div className="pt-8">
        <h1 className="text-base font-semibold sm:text-lg text-center">
          Heavy rotation
        </h1>
        {/*<p className="text-muted-foreground">
          Music, series, movies, and the visual references I keep coming back
          to.
        </p>*/}
      </div>

      <ShowcaseSection
        title="Albums on repeat"
        description="Covers that have been living in my queue lately."
        items={albums}
        aspectClassName="aspect-square"
        metaKey="artist"
      />

      <ShowcaseSection
        title="Watchlist"
        description="Stories and worlds that shape my taste for pacing, mood, and detail."
        items={movies}
        aspectClassName="aspect-[3/4]"
        metaKey="type"
      />
      <div>
        <h1 className="text-base font-semibold sm:text-lg">Gallery</h1>
        <p className="text-muted-foreground">
          Nothing Special just capture what i feel and see
        </p>
        <div className="mt-4 columns-2 gap-3 sm:columns-3">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="mb-3 break-inside-avoid overflow-hidden rounded-lg border border-border bg-secondary"
            >
              <div
                className={`${item.className} flex items-end p-3 text-xs font-medium text-white`}
              >
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-8">
          <Button variant="link" className="italic text-foreground">
            More Photos <MoveRight />
          </Button>
        </div>
      </div>
    </section>
  );
};
