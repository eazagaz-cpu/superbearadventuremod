import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../utils/seo';

export async function GET(context: any) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
      link: `/blog/${post.slug}/`,
    })),
  });
}
