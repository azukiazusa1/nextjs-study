type Config = {
  SOCKET_URL: string;
};

const config: Config = {
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3333',
};

export default config;
