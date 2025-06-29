/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'foodimages.example.com',
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add remote patterns for microservices
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081', // Menu service
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082', // Order service
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8083', // User service
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  async headers() {
    return [
      // API CORS headers
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
      // Security headers for all pages
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ];
  },
  
  async rewrites() {
    return [
      // User Service - Port 8083
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8083/api/users/:path*',
      },
      // Menu Service - Port 8081
      {
        source: '/api/menu/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
      // Order Service - Port 8082
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:8082/api/orders/:path*',
      },
      // Additional rewrites for categories and items
      {
        source: '/api/categories/:path*',
        destination: 'http://localhost:8081/api/categories/:path*',
      },
      {
        source: '/api/items/:path*',
        destination: 'http://localhost:8081/api/items/:path*',
      },
    ];
  },
  
  env: {
    NEXT_PUBLIC_APP_NAME: 'FoodOrder',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    // Add microservice URLs as environment variables
    NEXT_PUBLIC_USER_SERVICE_URL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8083',
    NEXT_PUBLIC_MENU_SERVICE_URL: process.env.NEXT_PUBLIC_MENU_SERVICE_URL || 'http://localhost:8081',
    NEXT_PUBLIC_ORDER_SERVICE_URL: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8082',
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          net: false,
          tls: false,
        },
      };
    }
    
    // Add webpack optimizations
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Additional Next.js optimizations
  poweredByHeader: false,
  compress: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Output configuration for Docker/production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Redirects for better SEO and UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/register',
        permanent: true,
      },
    ];
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
};

module.exports = nextConfig;