import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '@/context/socket';
import { RES_EVENTS } from 'models';

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
};

/**
 * カウントダウンタイマーを使用する
 */
type UseCountdown = () => UseCountdownReturn;

const toMinutes = (time: number): number => Math.floor(time / 60000);
const toSeconds = (time: number): number => Math.floor((time % 60000) / 1000);

const useCountdown: UseCountdown = () => {
  const socket = useContext(SocketContext);
  const [milliseconds, setMilliseconds] = useState(25 * 60 * 1000);
  const [minutes, setMinutes] = useState(toMinutes(milliseconds));
  const [seconds, setSeconds] = useState(toSeconds(milliseconds));
  const [remainngPercentage, setRemainngPercentage] = useState(100);

  useEffect(() => {
    socket.on(RES_EVENTS.TICK, (palyload) => {
      setMilliseconds(palyload.time);
      setMinutes(toMinutes(palyload.time));
      setSeconds(toSeconds(palyload.time));
      setRemainngPercentage(Math.round(palyload.remainngPercentage));
    });

    return () => {
      socket.off(RES_EVENTS.TICK);
    };
  }, [socket]);

  return {
    minutes,
    seconds,
    milliseconds,
    remainngPercentage,
  };
};

export default useCountdown;
