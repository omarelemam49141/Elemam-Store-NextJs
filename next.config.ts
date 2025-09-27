import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Webpack configuration to prevent scanning system directories
  webpack: (config, { dev, isServer }) => {
    // Prevent webpack from scanning outside project directory
    config.resolve.modules = ['node_modules', './src'];
    
    // Disable file system watching for problematic directories
    if (dev) {
      config.watchOptions = {
        ignored: [
          /node_modules/,
          /\.git/,
          /\.next/,
          /Application Data/,
          /AppData/,
          /Program Files/,
          /Windows/,
          /Cookies/,
          /C:\\Users\\.*\\Application Data/,
          /C:\\Users\\.*\\AppData/,
          /C:\\Users\\.*\\Cookies/
        ],
      };
    }
    
    // Add resolve restrictions for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        ws: false,
      };
    }
    
    // Handle WebSocket library for server-side
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('ws');
      }
    }
    
    return config;
  },
  
  // Experimental features for better serverless support
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
  },
};

export default nextConfig;
