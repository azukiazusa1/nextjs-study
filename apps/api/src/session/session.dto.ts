import { IsNotEmpty } from 'class-validator';
import type { JoinRoomRequest, Participant } from 'models/session';

export class RoomData {
  /**
   * 部屋を作成したユーザーのID
   */
  createdBy: string;
  /**
   * 部屋の作成日時（ミリ秒）
   */
  createdAt: number;
  /**
   * 部屋の参加者一覧
   */
  participants: Participant[];
  /**
   * 現在の部屋のセッションが休憩時間かどうか
   */
  isRestTime: boolean;
  /**
   * 部屋のセッションのタイマー
   */
  timer: NodeJS.Timeout;

  constructor(createdBy: string, timer: NodeJS.Timeout) {
    this.createdBy = createdBy;
    this.createdAt = Date.now();
    this.timer = timer;
    this.participants = [];
    this.isRestTime = false;
  }
}

export class JoinRoomDto implements JoinRoomRequest {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  avatar: string;
  @IsNotEmpty()
  score: number;
}
