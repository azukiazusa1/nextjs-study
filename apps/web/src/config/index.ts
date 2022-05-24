type Config = {
  SOCKET_URL: string;
  PUBLIC_GOOGLE_ANALYTICS_ID: string;
  SITE_URL: string;
};

const config: Config = {
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3333',
  PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  SITE_URL: process.env.VERCEL_URL || 'http://localhost:3000',
};

export default config;
