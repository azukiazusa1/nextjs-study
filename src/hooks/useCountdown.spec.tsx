import { renderHook } from '@testing-library/react';
import { createServer } from 'http';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

import { SocketContext } from '@/context/socket';
import { RES_EVENTS } from '@/model/session';

import useCountdown from './useCountdown';

describe('hooks/useCountdown', () => {
  let io: Server;
  let clientSocket: ClientSocket;
  let serverSocket: ServerSocket;
  let wrapper: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(3333, () => {
      clientSocket = Client(`http://localhost:3333`);
      io.on('connection', (socket) => {
        serverSocket = socket;
        done();
      });
    });
    // eslint-disable-next-line react/display-name
    wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider value={clientSocket}>{children}</SocketContext.Provider>
    );
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  describe('hooks/useCountdown', () => {
    test('tick イベントにより取得した経過時間を返す', async () => {
      const { result } = renderHook(() => useCountdown(), { wrapper });
      await act(async () => {
        serverSocket.emit(RES_EVENTS.TICK, {
          time: 1088000,
          remainngPercentage: 95.888,
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.milliseconds).toBe(1088000);
      expect(result.current.minutes).toBe(18);
      expect(result.current.seconds).toBe(8);
      expect(result.current.remainngPercentage).toBe(96);

      await act(async () => {
        serverSocket.emit(RES_EVENTS.TICK, {
          time: 12000,
          remainngPercentage: 8,
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.milliseconds).toBe(12000);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(12);
      expect(result.current.remainngPercentage).toBe(8);
    });
  });
});
