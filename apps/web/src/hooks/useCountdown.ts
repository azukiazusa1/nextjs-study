import { atom, useAtom } from 'jotai';
import { REST_TIME, WORK_TIME } from 'models';
import { useCallback, useRef } from 'react';

import { calcSessionTime } from '@/lib/session';


type UseCountdownReturn = {
  /**
   * 経過時間（分
   */
  minutes: number;
  /**
   * 経過時間（秒）
   */
  seconds: number;
  /**
   * 経過時間（ミリ秒）
   */
  milliseconds: number;
  /**
   * 進捗状況
   */
  remainngPercentage: number;
  /**
   * 現在休憩中かどうか
   */
  isRestTime: boolean;
  /**
   * カウントダウンを開始する
   * @param elapsedTime セッション開始からの全体の経過時間（ミリ秒）
   * @param onComplete カウントダウン終了時に実行する関数
   */
  startTimer: (elapsedTime: number, onComplete: (isRestTime: boolean) => void) => NodeJS.Timer;
};

/**
 * カウントダウンタイマーを使用する
 */
type UseCountdown = () => UseCountdownReturn;

const toMinutes = (time: number): number => Math.floor(time / 60000);
const toSeconds = (time: number): number => Math.floor((time % 60000) / 1000);
const calcRemainingPercentage = (time: number, diff: number): number =>
  Math.max(0, Math.min(100, ((time - diff) / time) * 100))

const millisecondsAtom = atom(0);
const secondsAtom = atom((get) => toSeconds(get(millisecondsAtom)));
const minutesAtom = atom((get) => toMinutes(get(millisecondsAtom)));
const remainngPercentageAtom = atom(100);
const isRestTimeAtom = atom(false);

const useCountdown: UseCountdown = () => {
  const startTimeRef = useRef(Date.now())
  const timeRef = useRef(WORK_TIME);
  const [milliseconds, setMilliseconds] = useAtom(millisecondsAtom);
  const [remainngPercentage, setRemainngPercentage] = useAtom(remainngPercentageAtom);
  const [isRestTime, setIsRestTime] = useAtom(isRestTimeAtom);

  const [seconds] = useAtom(secondsAtom);
  const [minutes] = useAtom(minutesAtom);


  const startTimer = useCallback((elapsedTime: number, onComplete: (isRestTime: boolean) => void) => {
    const { sessionElapsedTime, sessionRemainingTime, isRestTime } = calcSessionTime(elapsedTime);
    startTimeRef.current = startTimeRef.current - sessionElapsedTime;
    timeRef.current = isRestTime ? REST_TIME : WORK_TIME
    setIsRestTime(isRestTime);

    setMilliseconds(sessionRemainingTime);
    setRemainngPercentage(calcRemainingPercentage(timeRef.current, sessionElapsedTime));

    return setInterval(() => {
      const now = Date.now();
      const diff = now - startTimeRef.current;
      const milliseconds = timeRef.current - diff;
      setRemainngPercentage(calcRemainingPercentage(timeRef.current, diff));
      setMilliseconds(milliseconds);
      if (milliseconds <= 0) {
        onComplete(isRestTime);
        setIsRestTime((prev) => !prev);
        timeRef.current = isRestTime ? REST_TIME : WORK_TIME;
      }
    }, 1000);
  }, []);

  return {
    minutes,
    seconds,
    milliseconds,
    remainngPercentage,
    isRestTime,
    startTimer
  }
};

export default useCountdown;
