/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Docker 배포를 위한 설정
  images: {
    domains: [],
  },
}

module.exports = nextConfig

