import { renderHook, waitFor } from '@testing-library/react';
import { createServer } from 'http';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

import { SocketContext } from '@/context/socket';
import { Participant, RES_EVENTS } from '@/model/session';

import useParticipants from './useParticipants';

describe('hooks/useParticipants', () => {
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

  const participants: Participant[] = [
    {
      roomId: 'roomId',
      id: '1',
      username: 'test1',
      avatar: '',
      score: 0,
    },
    {
      roomId: 'roomId',
      id: '2',
      username: 'test2',
      avatar: '',
      score: 5,
    },
  ];

  test('参加者一覧が取得できること', async () => {
    const { result } = renderHook(() => useParticipants(), { wrapper });
    await act(async () => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        isRestTime: false,
        participants,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });
  });

  test('セッションが完了した時にスコアが加算されること', async () => {
    const { result } = renderHook(() => useParticipants(), { wrapper });
    await act(async () => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        isRestTime: false,
        participants,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });

    await act(async () => {
      serverSocket.emit(RES_EVENTS.COMPLETE, {
        score: 10,
        isRestTime: false,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual([
        {
          roomId: 'roomId',
          id: '1',
          username: 'test1',
          avatar: '',
          score: 10,
        },
        {
          roomId: 'roomId',
          id: '2',
          username: 'test2',
          avatar: '',
          score: 15,
        },
      ]);
    });
  });

  test('セッションが完了した時、スコアが0以下の場合スコアが加算されないこと', async () => {
    const { result } = renderHook(() => useParticipants(), { wrapper });

    await act(async () => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        isRestTime: false,
        participants,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });

    await act(async () => {
      serverSocket.emit(RES_EVENTS.COMPLETE, {
        score: -10,
        isRestTime: false,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });
  });

  test('参加者が追加されること', async () => {
    const { result } = renderHook(() => useParticipants(), { wrapper });

    await act(async () => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        isRestTime: false,
        participants,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });
    await act(async () => {
      serverSocket.emit(RES_EVENTS.PARTICIPATED, {
        participant: {
          roomId: 'roomId',
          id: '3',
          username: 'test3',
          avatar: '',
          score: 0,
        },
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual([
        ...participants,
        {
          roomId: 'roomId',
          id: '3',
          username: 'test3',
          avatar: '',
          score: 0,
        },
      ]);
    });
  });

  test('参加者が退出されること', async () => {
    const { result } = renderHook(() => useParticipants(), { wrapper });

    await act(async () => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        isRestTime: false,
        participants,
      });
    });
    await waitFor(() => {
      expect(result.current.participants).toEqual(participants);
    });
    await act(async () => {
      serverSocket.emit(RES_EVENTS.QUITED, {
        id: '2',
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual([
        {
          roomId: 'roomId',
          id: '1',
          username: 'test1',
          avatar: '',
          score: 0,
        },
      ]);
    });
  });
});
