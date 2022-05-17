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
        destination: `http://52.78.124.218:9000/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
