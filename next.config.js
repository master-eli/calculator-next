/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/calculator-next',
  assetPrefix: '/calculator-next',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
