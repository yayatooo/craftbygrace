import { useNavigate, useRouter } from "@tanstack/react-router";
import { FileText, ImageIcon, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { TitleText } from "#/components/title-text";
import { Badge } from "#/components/ui/badge";
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
import { Textarea } from "#/components/ui/textarea";
import {
  createBlogAction,
  updateBlogAction,
} from "#/features/blogs/blogs.actions";
import { blogsInputSchema } from "#/features/blogs/blogs.schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const BLOG_STATUSES = ["draft", "published", "archived"] as const;

type BlogStatus = (typeof BLOG_STATUSES)[number];

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  contentType: string;
  content: string;
  status: string;
  tags: string[];
  readingTime: number | null;
  publishedAt: Date | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type BlogsInputFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      blog: BlogItem;
    };

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isBlogStatus(value: string): value is BlogStatus {
  return BLOG_STATUSES.includes(value as BlogStatus);
}

const markdownPlaceholder = `# Solving an Odoo POS printer issue

Write **clear notes** for future you.

\`\`\`ts
const status = "fixed";
\`\`\`

- What happened
- What changed
- What to verify

[Read the docs](https://example.com)`;

export function BlogsInputForm(props: BlogsInputFormProps) {
  const { mode } = props;
  const blog = mode === "edit" ? props.blog : null;
  const router = useRouter();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPending, setIsPending] = useState(false);
  const [pendingStep, setPendingStep] = useState<
    "idle" | "uploading" | "saving"
  >("idle");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<BlogStatus>("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [shouldRemoveCoverImage, setShouldRemoveCoverImage] = useState(false);

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  useEffect(() => {
    if (!blog) return;

    const nextStatus = isBlogStatus(blog.status) ? blog.status : "draft";

    setTitle(blog.title);
    setSlug(blog.slug);
    setIsSlugManuallyEdited(true);
    setExcerpt(blog.excerpt ?? "");
    setStatus(nextStatus);
    setIsFeatured(blog.isFeatured);
    setTags(blog.tags);
    setTagInput("");
    setContent(blog.content);
    setCoverPreview((currentPreview) => {
      if (currentPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }

      return blog.coverImage;
    });
    setCoverFileName(null);
    setCoverImageFile(null);
    setShouldRemoveCoverImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [blog]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(value));
  }

  function addTag(value: string) {
    const tag = value.trim();

    if (!tag) {
      setTagInput("");
      return;
    }

    const exists = tags.some(
      (item) => item.toLowerCase() === tag.toLowerCase(),
    );

    if (!exists) {
      setTags((items) => [...items, tag]);
    }

    setTagInput("");
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== ",") return;

    event.preventDefault();
    addTag(tagInput);
  }

  function removeTag(tag: string) {
    setTags((items) => items.filter((item) => item !== tag));
  }

  function setSelectedCover(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Blog cover must be a PNG, JPG, or WEBP image.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Blog cover must be 5 MB or smaller.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(URL.createObjectURL(file));
    setCoverFileName(file.name);
    setCoverImageFile(file);
    setShouldRemoveCoverImage(false);
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedCover(file);
  }

  function removeCover() {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    if (mode === "edit" && coverImageFile && props.blog.coverImage) {
      setCoverPreview(props.blog.coverImage);
      setCoverFileName(null);
      setCoverImageFile(null);
      setShouldRemoveCoverImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setCoverPreview(null);
    setCoverFileName(null);
    setCoverImageFile(null);
    setShouldRemoveCoverImage(
      mode === "edit" && Boolean(props.blog.coverImage),
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm(form: HTMLFormElement | null) {
    form?.reset();
    setTitle("");
    setSlug("");
    setIsSlugManuallyEdited(false);
    setExcerpt("");
    setStatus("draft");
    setIsFeatured(false);
    setTags([]);
    setTagInput("");
    setContent("");
    removeCover();
    setShouldRemoveCoverImage(false);
  }

  function validateBlogInput(input: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    status: string;
    tags: string[];
    isFeatured: boolean;
  }) {
    if (!input.title) {
      toast.error("Blog title is required.");
      return false;
    }

    if (!input.slug) {
      toast.error("Blog slug is required.");
      return false;
    }

    if (!input.content) {
      toast.error("Blog content is required.");
      return false;
    }

    if (!isBlogStatus(input.status)) {
      toast.error("Invalid blog status.");
      return false;
    }

    const result = blogsInputSchema.safeParse({
      ...input,
      coverImage: null,
      contentType: "markdown",
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid blog data.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const input = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      status,
      tags,
      isFeatured,
    };

    if (!validateBlogInput(input)) return;

    setIsPending(true);

    try {
      if (mode === "create") {
        await createBlogAction(
          {
            ...input,
            status,
            coverImageFile,
          },
          {
            onUploading: () => setPendingStep("uploading"),
            onSaving: () => setPendingStep("saving"),
          },
        );

        toast.success("Blog created successfully");
        resetForm(form);
      } else {
        await updateBlogAction(
          {
            ...input,
            id: props.blog.id,
            status,
            currentCoverImage: props.blog.coverImage,
            coverImageFile,
            shouldRemoveCoverImage,
          },
          {
            onUploading: () => setPendingStep("uploading"),
            onSaving: () => setPendingStep("saving"),
          },
        );

        toast.success("Blog updated successfully");
      }

      await navigate({
        to: "/admin/blogs",
      });

      await router.invalidate({
        sync: true,
      });
    } catch (error) {
      console.error(`Failed to ${mode} blog:`, error);
      toast.error(
        mode === "create" ? "Failed to create blog." : "Failed to update blog.",
      );
    } finally {
      setIsPending(false);
      setPendingStep("idle");
    }
  }

  return (
    <div className="w-full space-y-6">
      {mode === "create" ? (
        <div>
          <TitleText>Create Blog</TitleText>
          <p className="text-sm text-muted-foreground">
            Write a Markdown article and save it as a draft or published story.
          </p>
        </div>
      ) : null}

      <Card className="w-full shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="size-5" />
                {mode === "create" ? "New Blog" : "Blog"}
              </CardTitle>
              <CardDescription>
                Create a Markdown blog post with optional cover image and tags.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Switch
                id="blog-featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                disabled={isPending}
              />
              <Label htmlFor="blog-featured" className="text-sm">
                Featured
              </Label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  id="blog-title"
                  name="title"
                  placeholder="Solving Odoo POS printer issue"
                  value={title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-slug">Slug</Label>
                <Input
                  id="blog-slug"
                  name="slug"
                  placeholder="solving-odoo-pos-printer-issue"
                  value={slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-2">
                <Label htmlFor="blog-excerpt">Excerpt</Label>
                <Textarea
                  id="blog-excerpt"
                  name="excerpt"
                  placeholder="A short summary of what this post covers."
                  className="min-h-28 resize-none"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Short summary shown in blog cards and previews.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    if (isBlogStatus(value)) {
                      setStatus(value);
                    }
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger id="blog-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_STATUSES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Published posts receive the current publish date on save.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-2">
                <Label htmlFor="blog-cover-image">Cover Image</Label>

                <label
                  htmlFor="blog-cover-image"
                  className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
                >
                  <Upload className="size-5 text-muted-foreground" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {coverFileName ?? "Choose cover image"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>

                  <Input
                    id="blog-cover-image"
                    name="coverImageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleCoverChange}
                    ref={fileInputRef}
                    disabled={isPending}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Blog cover preview"
                        className="size-full object-cover"
                      />

                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2 size-7"
                        onClick={removeCover}
                        aria-label="Remove blog cover image"
                        disabled={isPending}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
                      <ImageIcon className="size-5" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags</Label>
              <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeTag(tag);
                      }}
                      className="rounded-sm text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${tag}`}
                      disabled={isPending}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                <input
                  id="blog-tags"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Odoo, React, Drizzle" : ""}
                  className="min-w-48 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add a tag.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-content">Markdown Content</Label>
                <Textarea
                  id="blog-content"
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={markdownPlaceholder}
                  className="min-h-125 font-mono text-sm"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="min-h-125 overflow-auto rounded-md border bg-background p-4">
                  {content.trim() ? (
                    <div className="space-y-4 text-sm leading-7 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex min-h-117 items-center justify-center text-center text-sm text-muted-foreground">
                      Your Markdown preview will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => navigate({ to: "/admin/blogs" })}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                <Save className="size-4" />
                {pendingStep === "uploading"
                  ? "Uploading..."
                  : pendingStep === "saving"
                    ? "Saving..."
                    : mode === "edit"
                      ? "Save Changes"
                      : "Save Blog"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
