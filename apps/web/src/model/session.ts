/**
 * セッションの最大参加人数
 */
export const MAX_PARTICIPANTS = 4;

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
   * 部屋情報の取得
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
   * 部屋情報の取得
   */
  GET_ROOM_INFO: 'getRoomInfo',
} as const;

export interface MessageEventDto extends MessageDto {
  socketId?: string;
  roomId: string;
  avatar: string;
}

export interface MessageDto {
  order: number;
  username: string;
  content: string;
  createdAt: Date;
}

export interface ChatDto extends MessageDto {
  socketId?: string;
  roomId: string;
  avatar: string;
}

export interface Participant {
  roomId: string;
  id: string;
  username: string;
  avatar: string;
  score: number;
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

export interface JoinRoomDto {
  username: string;
  avatar: string;
  score: number;
}

export interface CompleteResult {
  /**
   * 次のセッションが休憩時間かどうか
   */
  isRestTime: boolean;
  /**
   * セッションの完了により取得したスコア
   */
  score: number;
}
