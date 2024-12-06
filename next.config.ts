/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['img.youtube.com'], 
    },
    transpilePackages: ['date-fns-tz'],
  }
  
  module.exports = nextConfig