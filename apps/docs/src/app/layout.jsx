import '@/styles/app.css';

import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import { Navbar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import NextTopLoader from 'nextjs-toploader';

// --- Metadata Configuration ---
export const metadata = {
  title: {
    default: 'TUWA Web3 Transaction Tracking Suite',
    template: '%s – TUWA Suite',
  },
  description:
    'A powerful, end-to-end solution to simplify and automate real-time transaction monitoring in your dApp.',
  keywords: ['web3', 'transaction tracking', 'react', 'zustand', 'wagmi', 'viem', 'ethereum', 'evm', 'gelato', 'safe'],
  authors: [{ name: 'Oleksandr Tkach', url: 'https://github.com/Argeare5' }],
  openGraph: {
    title: 'TUWA Web3 Transaction Tracking Suite',
    description:
      'A powerful, end-to-end solution to simplify and automate real-time transaction monitoring in your dApp.',
    url: 'https://docs.tuwa.io/',
    siteName: 'TUWA Suite Docs',
    images: [
      {
        url: 'https://your-docs-url.com/og-image.png', // TODO: preview image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TUWA Web3 Transaction Tracking Suite',
    description:
      'A powerful, end-to-end solution to simplify and automate real-time transaction monitoring in your dApp.',
    // creator: '@your_twitter_handle', // TODO: twitter handle
    images: ['https://your-docs-url.com/og-image.png'], // TODO: preview image
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="TUWA Web3 Transaction Tracking Suite Docs" />
      </Head>
      <body>
        <Layout
          navbar={<Navbar key="navbar" />}
          footer={<Footer key="footer" />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/web3-transactions-tracking/tree/main/apps/docs"
          navigation={{ prev: true, next: true }}
        >
          <NextTopLoader color="#6366f1" showSpinner={false} />
          {children}
        </Layout>
      </body>
    </html>
  );
}
