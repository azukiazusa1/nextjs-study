import { atom, useAtom } from "jotai";
import { Message, REQ_EVENTS } from "models";
import { useCallback, useContext } from "react";

import { SocketContext } from "@/context/socket";

type useMessagesReturn = {
  /**
   * 受信したメッセージ一覧
   * key: 参加者ID
   * value: メッセージ
   */
  messages: Map<string, string>;
  /**
   * メッセージを送信する
   * @param message メッセージの内容
   */
  sendMessage: (message: string) => void;
  /**
   * メッセージを追加する
   * メッセージは3秒後に自動で削除される
   * @param message メッセージ
   */
  addMessage: (message: Message) => void;
}

type UseMessages = () => useMessagesReturn;

const messagesAtom = atom<Map<string, string>>(new Map());

const useMessages: UseMessages = () => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useAtom(messagesAtom);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const newMessages = new Map(prev);
      newMessages.set(message.participantId, message.message);
      return newMessages;
    });

    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = new Map(prev);
        newMessages.delete(message.participantId);
        return newMessages;
      });
    }, 3000)
  }, [setMessages]);


  const sendMessage = useCallback((message: string) => {
    socket.emit(REQ_EVENTS.SEND_MESSAGE, message);
  }, [socket]);

  return {
    messages,
    sendMessage,
    addMessage,
  };
}

export default useMessages;