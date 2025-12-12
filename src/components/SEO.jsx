/**
 * SEO meta tags for the portfolio.
 */
import { Helmet } from 'react-helmet';

const rawSiteUrl = import.meta.env.VITE_SITE_URL || 'https://dino-bajramovic.com';
const siteUrl = rawSiteUrl.replace(/\/$/, '');
const pageTitle = 'Dino Bajramovic | Full-stack Web Developer & Engineer';
const description = 'Portfolio of Dino Bajramovic, a full-stack web developer delivering modern, performant React and Node.js solutions for the web.';
const keywords = [
  'Dino Bajramovic',
  'full-stack developer',
  'web developer',
  'React',
  'Node.js',
  'JavaScript',
  'portfolio'
].join(', ');
const canonicalUrl = `${siteUrl}/`;
const previewImage = `${siteUrl}/images/hero-banner.jpg`;
const searchConsoleVerification = import.meta.env.VITE_GSC_VERIFICATION || '';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dino Bajramovic',
  url: canonicalUrl,
  image: previewImage,
  jobTitle: 'Full-stack Web Developer',
  sameAs: [
    'https://github.com/dino-bajramovic',
    'https://www.linkedin.com/in/dino-bajramovic/',
    'https://x.com/DinoBajramovicc',
    'https://www.instagram.com/dinobajramovic_13/'
  ],
  email: 'mailto:dinobajramovic01@gmail.com'
};

const SEO = () => (
  <Helmet>
    <html lang="en" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content="Dino Bajramovic" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonicalUrl} />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Dino Bajramovic Portfolio" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={previewImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content={canonicalUrl} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={previewImage} />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:creator" content="@DinoBajramovicc" />

    {searchConsoleVerification ? (
      <meta name="google-site-verification" content={searchConsoleVerification} />
    ) : null}

    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  </Helmet>
);

export default SEO;
