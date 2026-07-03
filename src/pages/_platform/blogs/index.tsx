import { BlogsTableList } from "./blogs-table-list";

type BlogsAdminProps = {
	blogs?: Array<{
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
	}>;
};

export default function BlogsAdmin({ blogs = [] }: BlogsAdminProps) {
	return <BlogsTableList data={blogs} />;
}
