import { IsNotEmpty } from 'class-validator';
/**
 * セッションの最大参加人数
 */
export const MAX_PARTICIPANTS = 4;

/**
 * 作業時間（ミリ秒）
 */
export const WORK_TIME = 25 * 60 * 1000;

/**
 * 休憩時間（ミリ秒）
 */
export const REST_TIME = 5 * 60 * 1000;

/**
 * サーバーから送信されるイベント名
 */
export const RES_EVENTS = {
  /**
   * 自身が参加したとき
   */
  JOINED: 'joined',
  /**
   * 他のユーザーが参加したとき
   */
  PARTICIPATED: 'participated',
  /**
   * 他のユーザーが退出したとき
   */
  QUITED: 'quited',
  /**
   * 参加者情報の取得
   */
  ROOM_INFO: 'roomInfo',
  /**
   * タイマーのカウント
   */
  TICK: 'tick',
  /**
   * タイマーが完了したとき
   */
  COMPLETE: 'complete',
} as const;

/**
 * クライアントから送信するイベント名
 */
export const REQ_EVENTS = {
  /**
   * 参加
   */
  JOIN_ROOM: 'joinRoom',
  /**
   * 退出
   */
  QUIT: 'quit',
  /**
   * 部屋情報の
   */
  GET_ROOM_INFO: 'getRoomInfo',
} as const;

export interface Participant {
  roomId: string;
  id: string;
  username: string;
  avatar: string;
  score: number;
}

export class RoomData {
  createdBy: string;
  createdDate: Date;
  timer: NodeJS.Timeout | null;
  participants: Participant[];
  isRestTime: boolean;

  constructor(createdBy: string, timer: NodeJS.Timeout) {
    this.createdBy = createdBy;
    this.createdDate = new Date();
    this.timer = timer;
    this.participants = [];
    this.isRestTime = false;
  }
}

export interface RoomInfo {
  /**
   * セッションの参加者一覧
   */
  participants: Participant[];
  /**
   * 現在休憩時間かどうか
   */
  isRestTime: boolean;
}

export class JoinRoomDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  avatar: string;
  @IsNotEmpty()
  score: number;
}
