/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // REQUIRED for Docker
  images: {
    domains: ["github.com", "images.unsplash.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
