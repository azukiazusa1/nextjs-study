import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { Participant } from 'models';
import { nanoid } from 'nanoid';
import { JoinRoomDto } from './session.dto';

jest.mock('nanoid');
const mockedNanoid = nanoid as jest.Mock;
mockedNanoid.mockImplementation(() => 'nano-id');

describe('SessionService', () => {
  let service: SessionService;
  let fakeSessionRepository: any;

  beforeEach(async () => {
    fakeSessionRepository = {
      setParticipant: jest.fn(),
      deleteParticipant: jest.fn(),
      getParticipantCount: jest.fn(),
      getParticipants: jest.fn(),
      getRoomId: jest.fn(),
      getRoomCreatedAt: jest.fn(),
      deleteParticipantFromRoom: jest.fn(),
      deleteRoom: jest.fn(),
      isRoomExists: jest.fn(),
      getRandomAvailableRoom: jest.fn(),
      createRoom: jest.fn(),
      addParticipantToRoom: jest.fn(),
      registerParticipant: jest.fn(),
      removeAvailableRoom: jest.fn(),
      setAvailableRoom: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService, SessionRepository],
    })
      .overrideProvider(SessionRepository)
      .useValue(fakeSessionRepository)
      .compile();

    service = module.get<SessionService>(SessionService);
  });

  describe('connect', () => {
    test('通信が接続した時、ソケットIDを参加者として保存する', async () => {
      await service.connect('socketId');
      expect(fakeSessionRepository.setParticipant).toHaveBeenCalledWith('socketId');
    });
  });

  describe('disconnect', () => {
    test('通信が切断された時、参加者情報を削除する', async () => {
      fakeSessionRepository.getRoomId.mockResolvedValue('');

      const result = await service.disconnect('socketId');
      expect(fakeSessionRepository.deleteParticipant).toHaveBeenCalledWith('socketId');
      expect(result).toBe('');
    });

    test('参加者が部屋に所属している場合、部屋から参加者を削除する', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');
      fakeSessionRepository.getParticipantCount.mockReturnValue(2);

      const result = await service.disconnect('socketId');
      expect(fakeSessionRepository.deleteParticipantFromRoom).toHaveBeenCalledWith(
        'socketId',
        'roomId',
      );
      expect(fakeSessionRepository.deleteRoom).not.toHaveBeenCalled();
      expect(result).toBe('roomId');
    });

    test('参加者が部屋から削除された結果、部屋が空になった場合、部屋を削除する', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');
      fakeSessionRepository.getParticipantCount.mockReturnValue(0);

      const result = await service.disconnect('socketId');
      expect(fakeSessionRepository.deleteParticipantFromRoom).toHaveBeenCalledWith(
        'socketId',
        'roomId',
      );
      expect(fakeSessionRepository.deleteRoom).toHaveBeenCalledWith('roomId');
      expect(result).toBe('roomId');
    });
  });

  describe('getRoomInfo', () => {
    const participants: Participant[] = [
      {
        id: 'participant1',
        roomId: 'roomId',
        username: 'username1',
        avatar: '1',
        score: 0,
      },
      {
        id: 'participant2',
        roomId: 'roomId',
        username: 'username2',
        avatar: '2',
        score: 12,
      },
    ];

    test('参加者IDと部屋情報により、部屋情報を取得する', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');
      fakeSessionRepository.getParticipants.mockReturnValue(participants);
      fakeSessionRepository.isRoomExists.mockReturnValue(true);
      fakeSessionRepository.getRoomCreatedAt.mockReturnValue(123456789);

      const result = await service.getRoomInfo('participant1', 'roomId');
      expect(result).toEqual({
        participants,
        createdAt: 123456789,
        elapsedTime: expect.any(Number),
      });
    });

    test('部屋が存在しない場合、例外を返す', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');
      fakeSessionRepository.getParticipants.mockReturnValue(participants);
      fakeSessionRepository.isRoomExists.mockReturnValue(false);

      await expect(service.getRoomInfo('participant1', 'roomId')).rejects.toThrow(
        'Room roomId not found',
      );
    });

    test('参加者が部屋に所属していない場合、例外を返す', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');
      fakeSessionRepository.getParticipants.mockReturnValue(participants);
      fakeSessionRepository.isRoomExists.mockReturnValue(true);

      await expect(service.getRoomInfo('participant3', 'roomId')).rejects.toThrow(
        'Participant participant3 not found in room roomId',
      );
    });
  });

  describe('getRoomId', () => {
    test('参加者IDの所属する部屋IDを取得する', async () => {
      fakeSessionRepository.getRoomId.mockReturnValue('roomId');

      const result = await service.getRoomId('participant1');
      expect(result).toBe('roomId');
    });
  });

  describe('joinRoom', () => {
    const joinRoomDto: JoinRoomDto = {
      username: 'username',
      avatar: 'avatar',
      score: 12,
    };
    test('参加可能な部屋が存在しない場合、新規に部屋を作成して参加者を追加する', async () => {
      fakeSessionRepository.getRandomAvailableRoom.mockReturnValue(null);
      fakeSessionRepository.getParticipantCount.mockReturnValue(1);
      fakeSessionRepository.registerParticipant.mockReturnValue({
        id: 'participantId',
        roomId: 'nano-id',
        ...joinRoomDto,
      });

      const result = await service.joinRoom('participant1', joinRoomDto);
      expect(result).toEqual({
        roomId: 'nano-id',
        participant: {
          id: 'participantId',
          roomId: 'nano-id',
          username: 'username',
          avatar: 'avatar',
          score: 12,
        },
      });

      expect(fakeSessionRepository.createRoom).toHaveBeenCalledWith('nano-id');
      expect(fakeSessionRepository.addParticipantToRoom).toHaveBeenCalledWith(
        'participant1',
        'nano-id',
      );
      expect(fakeSessionRepository.removeAvailableRoom).not.toHaveBeenCalled();
      expect(fakeSessionRepository.registerParticipant).toHaveBeenCalledWith(
        'participant1',
        'nano-id',
        joinRoomDto,
      );
    });

    test('参加可能な部屋が存在する場合、参加者を追加する', async () => {
      fakeSessionRepository.getRandomAvailableRoom.mockReturnValue('roomId');
      fakeSessionRepository.getParticipantCount.mockReturnValue(2);
      fakeSessionRepository.registerParticipant.mockReturnValue({
        id: 'participantId',
        roomId: 'roomId',
        ...joinRoomDto,
      });

      const result = await service.joinRoom('participant1', joinRoomDto);
      expect(result).toEqual({
        roomId: 'roomId',
        participant: {
          id: 'participantId',
          roomId: 'roomId',
          username: 'username',
          avatar: 'avatar',
          score: 12,
        },
      });

      expect(fakeSessionRepository.createRoom).not.toHaveBeenCalled();
      expect(fakeSessionRepository.addParticipantToRoom).toHaveBeenCalledWith(
        'participant1',
        'roomId',
      );
      expect(fakeSessionRepository.removeAvailableRoom).not.toHaveBeenCalled();
      expect(fakeSessionRepository.registerParticipant).toHaveBeenCalledWith(
        'participant1',
        'roomId',
        joinRoomDto,
      );
    });

    test('新たに部屋に参加した結果参加者が4人になった場合、参加可能な部屋から削除する', async () => {
      fakeSessionRepository.getRandomAvailableRoom.mockReturnValue('roomId');
      fakeSessionRepository.getParticipantCount.mockReturnValue(4);

      await service.joinRoom('participant1', joinRoomDto);

      expect(fakeSessionRepository.createRoom).not.toHaveBeenCalled();
      expect(fakeSessionRepository.addParticipantToRoom).toHaveBeenCalledWith(
        'participant1',
        'roomId',
      );
      expect(fakeSessionRepository.removeAvailableRoom).toHaveBeenCalledWith('roomId');
    });
  });

  describe('quitRoom', () => {
    test('参加者が所属している部屋から参加者を削除し、参加可能な部屋一覧に追加する', async () => {
      fakeSessionRepository.getParticipantCount.mockReturnValue(3);

      const result = await service.quitRoom('participant1', 'roomId');

      expect(result).toBe('roomId');
      expect(fakeSessionRepository.deleteParticipant).toHaveBeenCalledWith('participant1');
      expect(fakeSessionRepository.deleteParticipantFromRoom).toHaveBeenCalledWith(
        'participant1',
        'roomId',
      );
      expect(fakeSessionRepository.deleteRoom).not.toHaveBeenCalled();
      expect(fakeSessionRepository.setAvailableRoom).toHaveBeenCalledWith('roomId');
    });

    test('参加者が離脱した結果、参加者が0人になった場合、部屋を削除する', async () => {
      fakeSessionRepository.getParticipantCount.mockReturnValue(0);

      const result = await service.quitRoom('participant1', 'roomId');

      expect(result).toBe('roomId');
      expect(fakeSessionRepository.deleteParticipant).toHaveBeenCalledWith('participant1');
      expect(fakeSessionRepository.deleteParticipantFromRoom).toHaveBeenCalledWith(
        'participant1',
        'roomId',
      );
      expect(fakeSessionRepository.deleteRoom).toHaveBeenCalledWith('roomId');
    });
  });
});
