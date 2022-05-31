/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    path: '/',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://api.bithumb.com/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `http://44.198.67.139:9000/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
