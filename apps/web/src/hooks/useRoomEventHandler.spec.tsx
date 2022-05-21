import { renderHook, waitFor } from '@testing-library/react';
import { createServer } from 'http';
import { Participant, RES_EVENTS } from 'models';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

import { SocketContext } from '@/context/socket';

import useAlert from './useAlert';
import useCountdown from './useCountdown';
import useMessages from './useMessages';
import useParticipants from './useParticipants';
import useRoomEventHandler from './useRoomEventHandler';

jest.mock('./useAlert');

const mockUseAlert = useAlert as jest.Mock;
mockUseAlert.mockImplementation(() => ({
  play: () => {},
}));
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

  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useRoomEventHandler(), { wrapper });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('部屋情報を受信した時、参加者を設定しタイマーをスタートする', async () => {
    const { result: participantsResult } = renderHook(() => useParticipants());
    const { result: countdownResult } = renderHook(() => useCountdown());

    const participants: Participant[] = [
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
    ];
    act(() => {
      serverSocket.emit(RES_EVENTS.ROOM_INFO, {
        elapsedTime: 20 * 60 * 1000,
        participants,
      });
    });

    await waitFor(() => {
      expect(participantsResult.current.participants.length).toBe(2);
      expect(countdownResult.current.minutes).toBe(5);
      expect(countdownResult.current.seconds).toBe(0);
      expect(countdownResult.current.isRestTime).toBe(false);
    });
  });

  test('他のユーザーがが部屋に参加した時、参加者が追加できること', async () => {
    const { result } = renderHook(() => useParticipants());
    const participant: Participant = {
      id: '3',
      roomId: 'roomId',
      username: 'user1',
      avatar: 'avatar1',
      score: 21,
    };
    act(() => {
      serverSocket.emit(RES_EVENTS.PARTICIPATED, { participant });
    });
    await waitFor(() => {
      expect(result.current.participants.length).toBe(3);
    });
  });

  test('他のユーザーが部屋から退出した時、参加者が削除されること', async () => {
    const { result } = renderHook(() => useParticipants());
    act(() => {
      serverSocket.emit(RES_EVENTS.QUITED, {
        id: '1',
      });
    });
    await waitFor(() => {
      expect(result.current.participants.length).toBe(2);
    });
  });

  test('メッセージが取得できること', async () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() => {
      serverSocket.emit(RES_EVENTS.MESSAGE, {
        participantId: '1',
        message: 'test-msg',
      });
    });
    await waitFor(() => {
      expect(result.current.messages.get('1')).toBe('test-msg');
    });
  });
});
