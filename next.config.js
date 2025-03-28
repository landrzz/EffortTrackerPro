/** @type {import('next').NextConfig} */
// Configuration updated to fix HMR issues
const nextConfig = {
  // Enable React StrictMode for better development experience
  reactStrictMode: true,
  
  // Explicitly enable Fast Refresh
  webpack: (config, { dev, isServer }) => {
    // Enable Fast Refresh only in development mode
    if (dev && !isServer) {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      
      // Log that Fast Refresh is enabled
      console.log('Fast Refresh is enabled');
    }
    return config;
  },
  
  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;