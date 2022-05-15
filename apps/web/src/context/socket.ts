import { createContext } from 'react';
import io, { Socket } from 'socket.io-client';

import config from '@/config';

export const socket = io(config.SOCKET_URL + '/session');
export const SocketContext = createContext<Socket>(undefined as never);
