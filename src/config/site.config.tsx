import { Metadata } from 'next';
// import logoImg from '@public/logoImg';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
// import logoImg  from '@public/ images/Elaan-logo';


export const siteConfig = {
  title: 'ProSale',
  description: `Isomorphic the ultimate React TypeScript Admin Template. Streamline your admin dashboard development with our feature-rich, responsive, and highly customizable solution. Boost productivity and create stunning admin interfaces effortlessly.`,
  logo: '/images/Elaan-logo.png',
  icon: '/images/Elaan-logo.png',
 
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - Client Portal` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - Client Portal` : title,
      description,
      url: 'https://isomorphic-furyroad.vercel.app',
      siteName: 'Client Portal', // https://developers.google.com/search/docs/appearance/site-names
      images: {
        url: 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/itemdep/isobanner.png',
        width: 1200,
        height: 630,
      },
      locale: 'en_US',
      type: 'website',
    },
  };
};
