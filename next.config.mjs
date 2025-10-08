// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://env-4498680.tip2.libyanspider.cloud/api/:path*', // Strapi بدون SSL
      },
    ];
  },
};

export default nextConfig;
