import { atom, useAtom } from 'jotai';
import { Participant } from 'models';
import { useCallback } from 'react';

type UseParticipantsReturn = {
  /**
   * 参加者一覧
   */
  participants: Participant[];
  /**
   * 参加者一覧を更新する
   */
  setParticipants: (participants: Participant[]) => void;
  /**
   * 参加者を追加する
   */
  addParticipant: (participant: Participant) => void;
  /**
   * 参加者を削除する
   */
  removeParticipant: (id: string) => void;
  /**
   * 全ての参加者のスコアを更新する
   */
  updateParticipantsScore: (score: number) => void;
};

/**
 * セッションの参加者情報を取得する
 */
type UseParticipants = () => UseParticipantsReturn;

const participantsAtom = atom<Participant[]>([]);

const useParticipants: UseParticipants = () => {
  const [participants, setParticipants] = useAtom(participantsAtom);

  const addParticipant = useCallback((participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  }, [setParticipants]);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, [setParticipants]);

  const updateParticipantsScore = useCallback((score: number) => {
    setParticipants((prev) =>
      prev.map((p) => {
        return {
          ...p,
          score: p.score + score,
        }
      }),
    );
  }, [setParticipants]);

  return {
    participants,
    setParticipants,
    addParticipant,
    removeParticipant,
    updateParticipantsScore,
  };
};

export default useParticipants;
