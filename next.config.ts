import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // NO usar output: 'export' para rutas dinámicas
  // Mantener el comportamiento SSR por defecto
  
  // Configuración de imágenes (sin unoptimized)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración para evitar errores con Node.js APIs en el cliente
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  
  // Configuración para Firebase Functions
  serverExternalPackages: ['firebase-admin'],
  
  // Variables de entorno personalizadas
  env: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
};

export default nextConfig;