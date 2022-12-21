/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";

const AppHead = () => {
  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>Lens Frens Fund</title>
      <meta name="title" content="The Lens Frens Fund" />
      <meta
        name="description"
        content="See how the sentiment of frens of Lens performs on the open market"
      />

      <link rel="icon" href="/favicon.ico" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      ></meta>

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://lensfrens.fund" />
      <meta property="og:title" content="The Lens Frens Fund" />
      <meta
        property="og:description"
        content="See how the sentiment of frens of Lens performs on the open market"
      />
      <meta property="og:image" content="https://lensfrens.xyz/lensfrensfund.png" />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://lensfrens.fund" />
      <meta property="twitter:title" content="The Lens Frens Fund" />
      <meta
        property="twitter:description"
        content="See how the sentiment of frens of Lens performs on the open market"
      />
      <meta property="twitter:image" content="https://lensfrens.fund/lensfrensfund.png" />

    </Head>
  );
};

export default AppHead;
