import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '@/context/socket';
import { CompleteResult, Participant, RES_EVENTS, RoomInfo } from '@/model/session';

type UseParticipantsReturn = {
  /**
   * 参加者一覧
   */
  participants: Participant[];
};

/**
 * セッションの参加者情報を取得する
 */
type UseParticipants = () => UseParticipantsReturn;

const useParticipants: UseParticipants = () => {
  const socket = useContext(SocketContext);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    socket.on(RES_EVENTS.ROOM_INFO, ({ participants }: RoomInfo) => {
      setParticipants(participants);
    });

    // セッションが完了した時、参加者一覧にスコアを加算する
    socket.on(RES_EVENTS.COMPLETE, ({ score }: CompleteResult) => {
      if (score > 0) {
        setParticipants((prev) =>
          prev.map((p) => {
            return {
              ...p,
              score: p.score + score,
            };
          }),
        );
      }
    });

    socket.on(RES_EVENTS.PARTICIPATED, ({ participant }: { participant: Participant }) => {
      setParticipants((prev) => [...prev, participant]);
    });

    socket.on(RES_EVENTS.QUITED, ({ id }: { id: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    });

    return () => {
      socket.off(RES_EVENTS.ROOM_INFO);
      socket.off(RES_EVENTS.COMPLETE);
      socket.off(RES_EVENTS.PARTICIPATED);
      socket.off(RES_EVENTS.QUITED);
    };
  }, [socket]);

  return {
    participants,
  };
};

export default useParticipants;
