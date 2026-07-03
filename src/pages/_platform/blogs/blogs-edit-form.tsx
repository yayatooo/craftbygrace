import { TitleText } from "#/components/title-text";

import { type BlogItem, BlogsInputForm } from "./blogs-input-form";

type BlogsEditFormProps = {
	blog: BlogItem;
};

export function BlogsEditForm({ blog }: BlogsEditFormProps) {
	return (
		<div className="w-full space-y-6">
			<div>
				<TitleText>Edit Blog</TitleText>
				<p className="text-sm text-muted-foreground">
					Update this Markdown article, cover image, tags, and publish status.
				</p>
			</div>

			<BlogsInputForm mode="edit" blog={blog} />
		</div>
	);
}
