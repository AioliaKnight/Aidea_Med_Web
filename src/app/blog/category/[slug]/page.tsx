import { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { BlogPage } from '@/components/blog/BlogPage';
import { Post } from '@/types/blog';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const category = await client.fetch(`
    *[_type == "category" && slug.current == $slug][0] {
      title,
      description
    }
  `, { slug });

  return {
    title: `${category?.title || slug} - AideaMed Blog`,
    description: category?.description || `Articles in category ${slug}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const postsPerPage = 9;

  // 獲取分類下的所有文章
  const posts = await client.fetch<Post[]>(`
    *[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      categories[]->{
        title,
        slug
      },
      author->{
        name,
        image,
        bio
      }
    }
  `, { slug });

  // 獲取分類資訊
  const category = await client.fetch(`
    *[_type == "category" && slug.current == $slug][0] {
      title,
      description
    }
  `, { slug });

  return (
    <BlogPage
      posts={posts}
      title={category?.title || slug}
      description={category?.description}
      currentPage={1}
      totalPosts={posts.length}
      postsPerPage={postsPerPage}
      isCategory={true}
      categorySlug={slug}
    />
  );
} 