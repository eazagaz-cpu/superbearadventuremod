export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export const SITE = {
  name: 'Super Bear Adventure Mod APK',
  url: 'https://superbearadventuremod.io',
  description: 'Download Super Bear Adventure Mod APK v12.1.5 (2026) with unlimited money, all skins unlocked, no ads, and the latest multiplayer fixes.',
  author: 'Super Bear Adventure Mod APK',
  email: 'info@superbearadventuremod.io',
  social: {
    twitter: 'https://x.com/Superbeardwp',
    pinterest: 'https://www.pinterest.com/superbeardadventuredmodio/_profile/',
    facebook: 'https://www.facebook.com/profile.php?id=615909357622194',
    instagram: 'https://www.instagram.com/superbeardadventuredmod.io/',
    threads: 'https://www.threads.com/@superbeardadventuredmod.io',
    youtube: 'https://www.youtube.com/channel/UCa6JSIKTYROwBnEfmXrBjsA',
    tiktok: 'https://www.tiktok.com/@superbeard2',
    whatsapp: 'https://whatsapp.com/channel/0029Vb6CmOHKgsNo6z7H1Z3p',
    reddit: 'https://www.reddit.com/user/SuperModAdventure/',
  },
  download: {
    url: 'https://pub-b6736eea3ae64221aa34004741cd7113.r2.dev/Super%20Bear%20Adventure%20Mod%20Apk/super-bear-adventure-mod-apk.apk',
    version: '12.1.5',
    size: '182 MB',
    requires: 'Android 5.1+',
    updated: 'April 29, 2026',
    developer: 'Earthkwak Games',
    category: 'Action / Platformer',
    rating: '4.4',
    downloads: '100M+',
    price: 'Free',
  },
};

export function getPageTitle(title?: string): string {
  if (!title) return `${SITE.name} v${SITE.download.version} (Unlocked) 2026`;
  return `${title} | ${SITE.name}`;
}
