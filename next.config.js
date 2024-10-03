/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vn1.vdrive.vn'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      }
    ]
  }
}

module.exports = nextConfig
