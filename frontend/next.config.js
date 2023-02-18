/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    PROD: process.env.PROD,
  },
};

module.exports = nextConfig;
