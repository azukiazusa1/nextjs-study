import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useSound from 'use-sound';

import Button from '@/components/Button/Button';
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer';
import Participants from '@/components/Participants/Participants';
import VolumeControl from '@/components/VolumeControl/VolumeControl';
import { SocketContext } from '@/context/socket';
import { CompleteResult, REQ_EVENTS, RES_EVENTS, RoomInfo } from '@/model/session';

import alertMp3 from '../../../public/sounds/alert.mp3';

const Room: NextPage = () => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [isRestTime, setIsRestTime] = useState(false);
  const [volume, setVolume] = useState(1);
  const [play] = useSound(alertMp3);

  /**
   * 退出ボタンが押された時の処理
   */
  const handleQuit = () => {
    // サーバーに退出要求を送信
    socket.emit(REQ_EVENTS.QUIT, router.query.roomId as string);
    router.push('/');
  };

  useEffect(() => {
    if (!socket.connected) {
      router.push('/');
    }

    // 部屋情報を取得
    socket.emit(REQ_EVENTS.GET_ROOM_INFO, router.query.roomId);

    // 部屋情報を受信した時、現在休憩時間かどうかを取得
    socket.on(RES_EVENTS.ROOM_INFO, ({ isRestTime }: RoomInfo) => {
      setIsRestTime(isRestTime);
    });

    // セッションが完了した時、スコアを取得する
    // 取得したスコアを現在のスコアに加算してローカルストレージに保存する
    socket.on(RES_EVENTS.COMPLETE, ({ score, isRestTime }: CompleteResult) => {
      const prevScore = Number(localStorage.getItem('score') || 0);
      localStorage.setItem('score', String(prevScore + score));

      setIsRestTime(isRestTime);
      if (isRestTime) {
        toast.success('セッションを完了しました🎉');
      } else {
        toast.info('休憩できましたか？引き続き頑張りましょう🙌');
      }
      play();
    });

    router.beforePopState(() => {
      // ルートに戻った時、サーバーに退出要求を送信
      socket.emit(REQ_EVENTS.QUIT, router.query.roomId as string);
      return true;
    });

    return () => {
      socket.off(RES_EVENTS.ROOM_INFO);
      socket.off(RES_EVENTS.COMPLETE);
    };
  }, [socket, router, play]);

  return (
    <div>
      <Head>
        <title>{isRestTime ? '休憩中👋' : '作業中✍️'}</title>
      </Head>

      <main>
        <div className="container mx-auto">
          <div className="flex justify-between p-4">
            <p className="font-bold text-2xl text-primary-content">
              {isRestTime ? '休憩中👋' : '作業中✍️'}
            </p>
            <Button color="error" outline onClick={handleQuit}>
              退出
            </Button>
          </div>
          <div className="grid place-items-center">
            <CountdownTimer />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Participants />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <VolumeControl volume={volume} onVolumeChange={(volume) => setVolume(volume)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;
