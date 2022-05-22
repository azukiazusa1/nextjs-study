import { Message, Participant, RES_EVENTS, RoomInfo } from "models"
import { useContext, useEffect, useRef } from "react"
import { toast } from "react-toastify"

import { SocketContext } from "@/context/socket"
import useParticipants from "@/hooks/useParticipants"
import { calcScore } from "@/lib/session"

import useAlert from "./useAlert"
import useCountdown from "./useCountdown"
import useMessages from "./useMessages"
/**
 * Web Socket によるイベントを受け取るためのハンドラを管理する
 */
const useRoomEventHandler = () => {
  const socket = useContext(SocketContext)
  const timerIdRef = useRef<NodeJS.Timer | undefined>(undefined)
  const { participants, setParticipants, addParticipant, removeParticipant, updateParticipantsScore } = useParticipants()
  const { play } = useAlert()
  const callback = useRef((isRestTime: boolean) => {
    const prevScore = Number(localStorage.getItem('score') || 0);
    const score = calcScore(participants, isRestTime);

    // セッションが完了した時、参加者一覧にスコアを加算し、
    // スコアをローカルストレージに保存する
    localStorage.setItem('score', String(prevScore + score));
    updateParticipantsScore(score);

    if (isRestTime) {
      toast.info('休憩できましたか？引き続き頑張りましょう🙌');
    } else {
      toast.success('セッションを完了しました🎉');
    }
    play();
  })
  const { addMessage } = useMessages()
  const { startTimer } = useCountdown()

  useEffect(() => {
    socket.on(RES_EVENTS.ROOM_INFO, ({ participants, elapsedTime }: RoomInfo) => {
      setParticipants(participants);
      if (!timerIdRef.current) {
        timerIdRef.current = startTimer(elapsedTime, callback.current)
      }
    });

    socket.on(RES_EVENTS.PARTICIPATED, ({ participant }: { participant: Participant }) => {
      addParticipant(participant);
    });

    socket.on(RES_EVENTS.QUITED, ({ id }: { id: string }) => {
      removeParticipant(id);
    });

    socket.on(RES_EVENTS.MESSAGE, (message: Message) => {
      addMessage(message);
    });

    return () => {
      socket.off(RES_EVENTS.ROOM_INFO);
      socket.off(RES_EVENTS.COMPLETE);
      socket.off(RES_EVENTS.PARTICIPATED);
      socket.off(RES_EVENTS.QUITED);
      socket.off(RES_EVENTS.MESSAGE);
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = undefined;
      }
    }
  }, []);
}

export default useRoomEventHandler;