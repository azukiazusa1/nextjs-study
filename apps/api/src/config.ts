type Config = {
  SOCKET_URL: string;
};

const config: Config = {
  SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:3333',
};

export default config;
