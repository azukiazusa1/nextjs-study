import { Message, REQ_EVENTS, RES_EVENTS } from "models";
import { useContext, useEffect, useState } from "react";

import { SocketContext } from "@/context/socket";

type useMessagesReturn = {
  /**
   * key: 参加者ID
   * value: メッセージ
   */
  messages: Map<string, string>;
  /**
   * メッセージを送信する
   * @param message メッセージの内容
   */
  sendMessage: (message: string) => void;
}

type UseMessages = () => useMessagesReturn;

const useMessages: UseMessages = () => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState(new Map<string, string>());

  useEffect(() => {
    socket.on(RES_EVENTS.MESSAGE, (message: Message) => {
      setMessages((prev) => {
        const newMessage = new Map(prev);
        newMessage.set(message.participantId, message.message);
        return newMessage;
      });

      setTimeout(() => {
        setMessages((prev) => {
          const newMessage = new Map(prev);
          newMessage.delete(message.participantId);
          return newMessage;
        });
      }, 3000);
    });

    return () => {
      socket.off(RES_EVENTS.MESSAGE);
    };
  }, [socket]);

  const sendMessage = (message: string) => {
    socket.emit(REQ_EVENTS.SEND_MESSAGE, message);
  };

  return {
    messages,
    sendMessage,
  };
}

export default useMessages;