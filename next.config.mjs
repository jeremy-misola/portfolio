import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true
      },
      {
        source: '/admin/:path*',
        destination: '/dashboard/:path*',
        permanent: true
      },
      {
        source: '/:locale(en|fr|zh)/admin',
        destination: '/:locale/dashboard',
        permanent: true
      },
      {
        source: '/:locale(en|fr|zh)/admin/:path*',
        destination: '/:locale/dashboard/:path*',
        permanent: true
      }
    ];
  }
};

export default withNextIntl(nextConfig);
