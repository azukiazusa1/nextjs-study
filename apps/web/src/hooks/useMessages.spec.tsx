import { renderHook, waitFor } from '@testing-library/react';
import { createServer } from 'http';
import { REQ_EVENTS } from 'models';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

import { SocketContext } from '@/context/socket';

import useMessages from './useMessages';

describe('hooks/useMessages', () => {
  let io: Server;
  let clientSocket: ClientSocket;
  let serverSocket: ServerSocket;
  let wrapper: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`);
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

  test('メッセージが取得できること', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() => {
      result.current.addMessage({
        participantId: '1',
        message: 'test',
      });
    });
    expect(result.current.messages.get('1')).toBe('test');
  });

  test('取得したメッセージは3秒後に削除されること', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() => {
      result.current.addMessage({
        participantId: '1',
        message: 'test',
      });
    });
    expect(result.current.messages.get('1')).toBe('test');

    await act(() => {
      {
        jest.advanceTimersByTime(3000);
      }
    });

    await waitFor(() => expect(result.current.messages.get('1')).toBe(undefined));
  });

  test('メッセージが送信できること', () => {
    const dumuySocket = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider value={dumuySocket}>{children}</SocketContext.Provider>
    );

    const { result } = renderHook(() => useMessages(), { wrapper });
    result.current.sendMessage('test');
    expect(dumuySocket.emit).toBeCalledWith(REQ_EVENTS.SEND_MESSAGE, 'test');
  });
});
