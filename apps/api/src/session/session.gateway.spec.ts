import { Test, TestingModule } from '@nestjs/testing';
import { RES_EVENTS } from 'models';
import { JoinRoomDto } from './session.dto';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';

describe('SessionGateway', () => {
  let gateway: SessionGateway;
  let fakeSessionService: any;
  let fakeSocket: any;
  let fakeServer: any;

  beforeEach(async () => {
    fakeSessionService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getRoomInfo: jest.fn(),
      joinRoom: jest.fn(),
      quitRoom: jest.fn(),
      getRoomId: jest.fn(),
    };

    fakeSocket = {
      id: 'socketId',
      emit: jest.fn(),
      leave: jest.fn(),
      joinRoom: jest.fn(),
      join: jest.fn(),
    };

    fakeServer = {
      to: jest.fn(),
      emit: jest.fn(),
    };

    fakeServer.to.mockReturnValue(fakeServer);

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionGateway, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(fakeSessionService)
      .compile();

    gateway = module.get<SessionGateway>(SessionGateway);
    gateway.afterInit(fakeServer);
  });

  describe('handleConnection', () => {
    test('通信が接続した時、ソケットIDを参加者として保存する', async () => {
      await gateway.handleConnection(fakeSocket);
      expect(fakeSessionService.connect).toHaveBeenCalledWith('socketId');
    });
  });

  describe('handleDisconnect', () => {
    test('通信が切断された時、参加者情報を削除する', async () => {
      fakeSessionService.disconnect.mockResolvedValue('');

      await gateway.handleDisconnect(fakeSocket);
      expect(fakeSessionService.disconnect).toHaveBeenCalledWith('socketId');
    });

    test('参加者が部屋に所属している場合、部屋から参加者を削除し他の参加者に通知する', async () => {
      fakeSessionService.disconnect.mockResolvedValue('roomId');

      await gateway.handleDisconnect(fakeSocket);
      expect(fakeSocket.leave).toHaveBeenCalledWith('roomId');
      expect(fakeServer.to).toHaveBeenCalledWith('roomId');
      expect(fakeServer.emit).toHaveBeenCalledWith(RES_EVENTS.QUITED, {
        id: 'socketId',
      });
    });
  });

  describe('getRoomInfo', () => {
    test('部屋情報を取得する', async () => {
      fakeSessionService.getRoomInfo.mockResolvedValue({
        id: 'roomId',
        createdAt: 123456789,
        elapsedTime: 0,
        participants: [],
      });

      const res = await gateway.getRoomInfo(fakeSocket, 'roomId');
      expect(fakeSessionService.getRoomInfo).toHaveBeenCalledWith('socketId', 'roomId');
      expect(res).toEqual({
        event: RES_EVENTS.ROOM_INFO,
        data: {
          id: 'roomId',
          createdAt: 123456789,
          elapsedTime: 0,
          participants: [],
        },
      });
    });

    test('部屋が存在しない場合、エラーを返す', async () => {
      fakeSessionService.getRoomInfo.mockImplementation(() => {
        throw new Error();
      });

      expect(gateway.getRoomInfo(fakeSocket, 'roomId')).rejects.toThrow();
    });
  });

  describe('joinRoom', () => {
    const joinRoomDto: JoinRoomDto = {
      username: 'username',
      avatar: '1',
      score: 8,
    };
    test('部屋に参加した時、参加者に通知して部屋IDを返却する', async () => {
      fakeSessionService.getRoomId.mockResolvedValue('roomId');
      fakeSessionService.joinRoom.mockResolvedValue({
        roomId: 'roomId',
        participant: {
          id: 'socketId',
          ...joinRoomDto,
        },
      });

      const res = await gateway.joinRoom(fakeSocket, joinRoomDto);

      expect(fakeServer.to).toHaveBeenCalledWith('roomId');
      expect(fakeServer.emit).toHaveBeenCalledWith(RES_EVENTS.PARTICIPATED, {
        participant: {
          id: 'socketId',
          ...joinRoomDto,
        },
      });
      expect(res).toEqual({
        event: RES_EVENTS.JOINED,
        data: {
          roomId: 'roomId',
        },
      });
    });
  });

  describe('quit', () => {
    test('部屋から参加者を削除し他の参加者に通知する', async () => {
      await gateway.quit(fakeSocket, 'roomId');
      expect(fakeSocket.leave).toHaveBeenCalledWith('roomId');
      expect(fakeServer.to).toHaveBeenCalledWith('roomId');
      expect(fakeServer.emit).toHaveBeenCalledWith(RES_EVENTS.QUITED, {
        id: 'socketId',
      });
    });
  });

  describe('sendMessage', () => {
    test('部屋にメッセージを送信する', async () => {
      fakeSessionService.getRoomId.mockReturnValue('roomId');
      await gateway.sendMessage(fakeSocket, 'message');
      expect(fakeServer.to).toHaveBeenCalledWith('roomId');
      expect(fakeServer.emit).toHaveBeenCalledWith(RES_EVENTS.MESSAGE, {
        participantId: 'socketId',
        message: 'message',
      });
    });

    test('参加者が部屋に存在しない場合', async () => {
      fakeSessionService.getRoomId.mockReturnValue('');
      await gateway.sendMessage(fakeSocket, 'message');
      expect(fakeServer.to).not.toHaveBeenCalled();
      expect(fakeServer.emit).not.toHaveBeenCalled();
    });
  });
});
