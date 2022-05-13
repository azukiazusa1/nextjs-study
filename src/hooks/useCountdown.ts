import { useEffect, useState } from "react";

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
   * カウントダウンが終了したかどうか
   */
  end: boolean;
  /**
   * 進捗状況
   */
  remainngPercentage: number;
}

/**
 * カウントダウンタイマーを使用する
 * 
 * @param time カウントする時間（ミリ秒）
 * @returns [minutes, seconds, milliseconds] のタプル
 */
type UseCountdown = (time: number) => UseCountdownReturn;

const toMinutes = (time: number): number => Math.floor(time / 60000);
const toSeconds = (time: number): number => Math.floor((time % 60000) / 1000);

const useCountdown: UseCountdown = (
  time: number,
) => {
  const [startTime] = useState(Date.now());
  const [milliseconds, setMilliseconds] = useState(time);
  const [minutes, setMinutes] = useState(toMinutes(milliseconds));
  const [seconds, setSeconds] = useState(toSeconds(milliseconds));
  const [remainngPercentage, setRemainngPercentage] = useState(100);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      const newMilliseconds = time - diff;
      const minutes = Math.max(toMinutes(newMilliseconds), 0);
      const seconds = Math.max(toSeconds(newMilliseconds), 0);
      setMinutes(minutes);
      setSeconds(seconds);
      setMilliseconds(newMilliseconds);
      setRemainngPercentage(Math.max(0, Math.min(100, (time - diff) / time * 100)));
      if (newMilliseconds <= 0) {
        setEnd(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, time]);

  return {
    minutes,
    seconds,
    milliseconds,
    remainngPercentage,
    end,
  };
}

export default useCountdown