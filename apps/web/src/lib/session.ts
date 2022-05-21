import { Participant, REST_TIME, WORK_TIME } from "models";

/**
 * ルームの経過時間から、今回のセッションの残り時間を計算する
 * @param elapsedTime 経過時間
 * @returns sessionElapsedTime:今回のセッションの経過時間 (ミリ秒)
 * @returns sessionRemainingTime:今回のセッションの残り時間 (ミリ秒)
 * @returns isRestTime:現在休憩中かどうか
 */
export const calcSessionTime = (elapsedTime: number): { sessionElapsedTime: number, sessionRemainingTime: number, isRestTime: boolean } => {
  const SESSION_TIME = REST_TIME + WORK_TIME;
  while (elapsedTime > SESSION_TIME) {
    elapsedTime -= SESSION_TIME;
  }
  const isRestTime = elapsedTime > WORK_TIME;
  const sessionRemainingTime = (isRestTime ? REST_TIME - (elapsedTime - WORK_TIME) : WORK_TIME - elapsedTime);
  const sessionElapsedTime = isRestTime ? elapsedTime - WORK_TIME : elapsedTime;

  return { sessionElapsedTime, sessionRemainingTime, isRestTime };
}

/**
 * セッションで獲得したスコアを計算する
 * @param participants 参加者一覧
 * @param isRestTime 完了したセッションが休憩中かどうか
 * @returns 今回のセッションで獲得したスコア
 */
export const calcScore = (participants: Participant[], isRestTime: boolean): number => {
  // 休憩時間 → 作業時間の場合獲得スコアは0
  if (isRestTime) {
    return 0;
  }

  // 作業時間 → 休憩時間の場合参加者の数だけスコアを獲得する
  const score = participants.length;
  return score
}