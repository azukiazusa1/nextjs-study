import Redis from 'ioredis';

import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Participant } from 'models';
import { JoinRoomDto } from './session.dto';

@Injectable()
export class SessionRepository {
  constructor(@InjectRedis() private readonly client: Redis) { }

  /**
   * 参加者をセットする
   * @param participantId 参加者ID
   */
  async setParticipant(participantId: string): Promise<void> {
    await this.client.set(`participant:${participantId}:room`, '');
  }

  /**
   * 参加者情報を登録する
   * @param participantId
   * @prams createRoomDto 参加者情報
   */
  async registerParticipant(
    participantId: string,
    roomId: string,
    { username, avatar, score }: JoinRoomDto,
  ): Promise<Participant> {
    await this.client.hmset(`participant:${participantId}`, {
      username,
      avatar,
      score: score.toString(),
    });

    const participant: Participant = {
      id: participantId,
      roomId,
      username,
      avatar,
      score,
    };

    return participant;
  }

  /**
   * 参加者が参加している部屋IDを取得する
   * @param participantId 参加者ID
   * @returns 参加している部屋ID (存在しない場合は空文字)
   */
  async getRoomId(participantId: string): Promise<string> {
    return this.client.get(`participant:${participantId}:room`);
  }

  /**
   * 参加者を削除する
   * @param participantId 参加者ID
   */
  async deleteParticipant(participantId: string): Promise<void> {
    await this.client.del(`participant:${participantId}:room`);
  }

  /**
   * 部屋に参加している参加者の一覧を取得する
   * @param roomId 部屋ID
   * @returns 参加している参加者の一覧
   */
  async getParticipants(roomId: string): Promise<Participant[]> {
    const participantIds = await this.client.smembers(`room:${roomId}:paticipants`);

    const participants = await Promise.all(
      participantIds.map(async (id) => {
        const [username, avatar, score] = await this.client.hmget(
          `participant:${id}`,
          'username',
          'avatar',
          'score',
        );
        return { id, username, avatar, score: Number(score), roomId };
      }),
    );

    return participants;
  }

  /**
   * 部屋が作成された日時を取得する
   * @param roomId
   * @returns 部屋が作成された日時（ミリ秒）
   */
  async getRoomCreatedAt(roomId: string): Promise<number> {
    const createdAt = await this.client.hget(`room:${roomId}`, 'createdAt');
    return Number(createdAt);
  }

  /**
   * 部屋が存在するかどうかを判定する
   * @param roomId 部屋ID
   */
  async isRoomExists(roomId: string): Promise<boolean> {
    return (await this.client.hexists(`room:${roomId}`, 'createdAt')) > 0;
  }

  /**
   * 部屋に参加している人数を取得する
   * @param roomId
   * @returns 参加している人数
   */
  async getParticipantCount(roomId: string): Promise<number> {
    return this.client.scard(`room:${roomId}:paticipants`);
  }

  /**
   * 部屋から参加者を削除する
   * @param participantId 参加者ID
   * @param roomId 部屋ID
   * @returns 削除した数
   */
  async deleteParticipantFromRoom(participantId: string, roomId: string): Promise<void> {
    await this.client.srem(`room:${roomId}:paticipants`, participantId);
  }

  /**
   * 新しい部屋を作成する
   * @param roomId 部屋ID
   */
  async createRoom(roomId: string): Promise<void> {
    await this.client.hset(`room:${roomId}`, 'createdAt', Date.now());
    return;
  }

  /**
   * 部屋に参加者を追加する
   * @param participantId 参加者ID
   * @param roomId 部屋ID
   */
  async addParticipantToRoom(participantId: string, roomId: string): Promise<void> {
    await this.client.sadd(`room:${roomId}:paticipants`, participantId);
    await this.client.set(`participant:${participantId}:room`, roomId);
  }

  /**
   * 参加可能な部屋をランダムに一つ取得する
   * @returns 参加可能な部屋ID
   */
  async getRandomAvailableRoom(): Promise<string | null> {
    return (await this.client.srandmember('availableRooms')) as string | null;
  }

  /**
   * 参加可能な部屋一覧に追加する
   * @param roomId 部屋ID
   */
  async setAvailableRoom(roomId: string): Promise<void> {
    await this.client.sadd('availableRooms', roomId);
  }

  /**
   * 参加可能な部屋の一覧から削除する
   * @param roomId 部屋ID
   */
  async removeAvailableRoom(roomId: string): Promise<void> {
    await this.client.srem('availableRooms', roomId);
  }
  /**
   * 部屋情報を削除する
   * @param roomId 部屋ID
   */
  async deleteRoom(roomId: string): Promise<void> {
    await this.client.del(`room:${roomId}`);
    await this.client.del(`room:${roomId}:paticipants`);
    await this.client.srem('availableRooms', roomId);
  }
}
