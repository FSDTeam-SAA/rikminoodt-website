/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // REQUIRED for Docker
  images: {
    domains: ["github.com", "images.unsplash.com"],
  },
};

export default nextConfig;
