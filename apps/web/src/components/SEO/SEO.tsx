import Head from 'next/head';
import React from 'react';

import config from '@/config';

const SEO: React.FC = () => {
  const title = 'ポモドーロセッション';
  const description =
    'ポモドーロセッションは、最大4人で集まってポモドーロ・テクニックを実践するサービスです。';
  const imageHeight = '1200';
  const imageWidth = '630';

  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={config.SITE_URL} />
      <meta property="og:image" content="/logo_transparent.png" />
      <meta property="og:image:width" content={imageHeight} />
      <meta property="og:image:height" content={imageWidth} />
      <meta property="og:site_name" content={title} />
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🍅</text></svg>"
      />
    </Head>
  );
};

export default SEO;
