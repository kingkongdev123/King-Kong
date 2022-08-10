/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    SOLANA_NETWORK: "devnet"
  }
}

module.exports = nextConfig
