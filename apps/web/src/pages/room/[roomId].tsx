import { REQ_EVENTS } from 'models';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import AlertVolumeControl from '@/components/AlertVolumeControl';
import Button from '@/components/Button/Button';
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer';
import EmojiPicker from '@/components/EmojiPicker/EmojiPicker';
import Participants from '@/components/Participants/Participants';
import { SocketContext } from '@/context/socket';
import useCountdown from '@/hooks/useCountdown';
import useRoomEventHandler from '@/hooks/useRoomEventHandler';

const Room: NextPage = () => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { isRestTime } = useCountdown();
  const [volume, setVolume] = useState(1);

  /**
   * 退出ボタンが押された時の処理
   */
  const handleQuit = () => {
    // サーバーに退出要求を送信
    socket.emit(REQ_EVENTS.QUIT, router.query.roomId as string);
    router.push('/');
  };

  useRoomEventHandler();

  useEffect(() => {
    if (!socket.connected) {
      router.push('/');
    }

    // 部屋情報を取得
    socket.emit(REQ_EVENTS.GET_ROOM_INFO, router.query.roomId);

    router.beforePopState(() => {
      // ルートに戻った時、サーバーに退出要求を送信
      socket.emit(REQ_EVENTS.QUIT, router.query.roomId as string);
      return true;
    });
  }, [socket, router]);

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
          <div className="mt-4 p-2 grid grid-cols-1 md:grid-cols-4 gap-8">
            <Participants />
          </div>
          <div className="mt-8 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
            <EmojiPicker />
            <AlertVolumeControl />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;
