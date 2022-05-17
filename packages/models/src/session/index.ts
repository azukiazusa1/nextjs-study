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
  /**
   * メッセージの受信
   */
  MESSAGE: 'message',
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
  /**
   * メッセージの送信
   */
  SEND_MESSAGE: 'sendMessage',
} as const;

/**
 * セッションの参加者
 */
export interface Participant {
  /**
   * 参加者のID
   */
  id: string;
  /**
   * 参加している部屋のID
   */
  roomId: string;
  /**
   * 参加者の名前
   */
  username: string;
  /**
   * 参加者のアバター
   */
  avatar: string;
  /**
   * 参加者のスコア
   */
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

/**
 * 部屋に参加するリクエストデータ
 */
export interface JoinRoomRequest {
  /**
   * 参加者の名前
   */
  username: string;
  /**
   * 参加者のアバター
   */
  avatar: string;
  /**
   * 初期スコア
   */
  score: number;
}

/**
 * セッションが終了したときのイベント
 */
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

export interface Message {
  /**
   * 送信者のID
   */
  participantId: string;
  /**
   * 送信内容
   */
  message: string;
}
