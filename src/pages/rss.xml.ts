/**
 * 风林集 · RSS 2.0 订阅源
 * ─────────────────────────────
 * 零依赖手写，构建期静态产出 /rss.xml。
 * 每条目带标题、摘要、日期、分类与标签；摘要取 front-matter 的 description。
 */
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import type { APIRoute } from 'astro';

const ORIGIN = 'https://snappy.blog';

/** XML 文本转义（& < > " '） */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const lastBuild = posts[0]?.data.date ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${ORIGIN}/posts/${post.id}/`;
      const cats = [post.data.category, ...post.data.tags]
        .map((c) => `      <category>${esc(c)}</category>`)
        .join('\n');
      return `    <item>
      <title>${esc(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${esc(post.data.description || '')}</description>
${cats}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${ORIGIN}/</link>
    <description>${esc(`${SITE.motto} —— ${SITE.name}，随笔与讲义的私人园地`)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
