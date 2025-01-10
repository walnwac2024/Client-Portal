

import Head from 'next/head';
import './globals.css';
import { Inter } from 'next/font/google';
import toast, { Toaster } from 'react-hot-toast';
import { usePathname,useRouter } from 'next/navigation';
const inter = Inter({ subsets: ['latin'] });
import Image from 'next/image';
import axios from "axios";
import { siteConfig } from '@/config/site.config';
import { routes } from "@/config/routes";
import Navbar from '@/components/ui/Navbar/Navbar';
export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en">
      <Head>
        {/* Manifest file */}
        <link rel="manifest" href="/manifest.json" />
        {/* Meta tags */}
        <meta name="theme-color" content="#000000" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Custom favicon */}
        <link rel="icon" type="image/png"  href="/images/Elaan-logo.png" />
      </Head>
      <body className={`${inter.className} bg-white`}>
       <Navbar/>
        <div className="bg-white w-full">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
}
