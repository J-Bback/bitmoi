/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewirtes() {
    return [
      {
        source: '/api/:path*',
        destination: `API주소/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
