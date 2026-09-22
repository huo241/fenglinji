/**
 * 风林集 · 配置入口
 * ─────────────────────────────
 * 实际内容在 src/data/site.json —— 那个 JSON 就是"设置面板"的数据源，
 * 既可以在里面直接改，也已经被 Pages CMS 后台映射成表单。
 *
 * 手动改：编辑 src/data/site.json
 * 网页改：Pages CMS 后台 → "站点设置"
 * 改完部署即可生效。
 */

import siteJson from './data/site.json';

export interface SocialLink {
  url: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  motto: string;
  footer: string;
  avatarText: string;
  avatarUrl: string;
  ownerName: string;
  bio: string;
  socials: {
    github: SocialLink;
    email: SocialLink;
  };
  sections: SectionConfig[];
}

export interface SectionConfig {
  key: string;
  label: string;
  tagline: string;
}

export const SITE = siteJson as SiteConfig;

export const SECTIONS = SITE.sections;

export type SectionKey = SectionConfig['key'];
