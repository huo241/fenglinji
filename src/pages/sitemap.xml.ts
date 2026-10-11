/**
 * 风林集 · sitemap.xml
 * ─────────────────────────────
 * 零依赖手写，构建期静态产出 /sitemap.xml。
 * 收录：首页、各板块页、全部文章页。
 * 排除：/admin、/settings（后台，noindex）、404。
 */
import { getCollection } from 'astro:content';
import { SECTIONS } from '../config';
import type { APIRoute } from 'astro';

const ORIGIN = 'https://snappy.blog';

const iso = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const latest = posts[0]?.data.date ?? new Date();

  const urls: { loc: string; lastmod: string; priority: string }[] = [
    { loc: `${ORIGIN}/`, lastmod: iso(latest), priority: '1.0' },
    ...SECTIONS.map((s) => ({
      loc: `${ORIGIN}/${s.key}/`,
      lastmod: iso(latest),
      priority: '0.8',
    })),
    ...posts.map((p) => ({
      loc: `${ORIGIN}/posts/${p.id}/`,
      lastmod: iso(p.data.date),
      priority: '0.7',
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
