/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vn1.vdrive.vn'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/images/**',
      }
    ]
  },
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

module.exports = nextConfig
