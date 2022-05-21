import { Injectable } from '@nestjs/common';
import { MAX_PARTICIPANTS, Participant, RoomInfo } from 'models';
import { nanoid } from 'nanoid';
import { JoinRoomDto } from './session.dto';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async connect(participantId: string): Promise<void> {
    await this.sessionRepository.setParticipant(participantId);
  }

  /**
   * 参加者の接続が切れたときに呼ばれる
   * @param participantId 参加者ID
   * @returns 接続が切れた参加者が参加している部屋ID
   */
  async disconnect(participantId: string): Promise<string> {
    // 参加者が参加している部屋IDを取得
    const roomId = await this.sessionRepository.getRoomId(participantId);

    if (roomId) {
      // 参加者が参加している部屋から参加者を削除
      await this.sessionRepository.deleteParticipantFromRoom(participantId, roomId);
      // 参加者が参加している部屋に参加者がいなくなる場合は部屋を削除
      if ((await this.sessionRepository.getParticipantCount(roomId)) === 0) {
        await this.sessionRepository.deleteRoom(roomId);
      }
    }

    this.sessionRepository.deleteParticipant(participantId);
    return roomId;
  }

  /**
   * 部屋情報を取得する
   * @param participantId 参加者ID
   * @param roomId 部屋ID
   * @returns 部屋情報
   */
  async getRoomInfo(participantId: string, roomId: string): Promise<RoomInfo> {
    // 部屋情報が見つからない
    if (!(await this.sessionRepository.isRoomExists(roomId))) {
      throw new Error(`Room ${roomId} not found`);
    }

    const participants = await this.sessionRepository.getParticipants(roomId);
    const participantIds = participants.map((participant) => participant.id);
    // 指定した部屋に参加者がいない
    if (!participantIds.includes(participantId)) {
      throw new Error(`Participant ${participantId} not found in room ${roomId}`);
    }

    const createdAt = await this.sessionRepository.getRoomCreatedAt(roomId);
    const elapsedTime = Date.now() - createdAt;

    return {
      participants,
      createdAt,
      elapsedTime,
    };
  }

  /**
   * 部屋IDを取得する
   * @param participantId
   * @returns 部屋ID
   */
  async getRoomId(participantId: string): Promise<string> {
    return this.sessionRepository.getRoomId(participantId);
  }

  /**
   * 部屋に参加する
   * @param participantId 参加者ID
   * @param joinRoomDto 参加者情報
   * @returns 部屋ID
   */
  async joinRoom(
    participantId: string,
    joinRoomDto: JoinRoomDto,
  ): Promise<{
    roomId: string;
    participant: Participant;
  }> {
    let roomId: string | null;

    // 参加可能な部屋があるかどうか
    roomId = await this.sessionRepository.getRandomAvailableRoom();
    if (!roomId) {
      roomId = nanoid();
      await this.sessionRepository.createRoom(roomId);
    }

    // 参加者を部屋に追加
    await this.sessionRepository.addParticipantToRoom(participantId, roomId);

    // 参加者が満員である場合は、入室可能な部屋一覧から削除
    if ((await this.sessionRepository.getParticipantCount(roomId)) === MAX_PARTICIPANTS) {
      await this.sessionRepository.removeAvailableRoom(roomId);
    }

    // 参加者情報を設定
    const participant = await this.sessionRepository.registerParticipant(
      participantId,
      roomId,
      joinRoomDto,
    );

    return {
      roomId,
      participant,
    };
  }

  /**
   * 部屋から離脱する
   * @param participantId 参加者ID
   * @returns roomid 部屋ID
   * @returns 部屋ID
   */
  async quitRoom(participantId: string, roomId: string): Promise<string> {
    await this.sessionRepository.deleteParticipant(participantId);
    await this.sessionRepository.deleteParticipantFromRoom(participantId, roomId);

    if ((await this.sessionRepository.getParticipantCount(roomId)) === 0) {
      await this.sessionRepository.deleteRoom(roomId);
    } else {
      // 参加者が抜けたので入室可能であるはず
      // Set型なので重複しない
      await this.sessionRepository.setAvailableRoom(roomId);
    }
    return roomId;
  }
}
