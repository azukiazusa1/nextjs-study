import { MAX_PARTICIPANTS } from 'models';
import React from 'react';

import SkeltonUser from '@/components/SkeltonUser/SkeltonUser';
import User from '@/components/User/User';
import useParticipants from '@/hooks/useParticipants';

const Participants: React.FC = () => {
  const { participants } = useParticipants();

  // セッションの最大参加者数に満たさない場合は、
  // その数だけスケルトンユーザーを表示する
  const skeltonUsers = Array.from(
    Array(Math.max(MAX_PARTICIPANTS - participants.length, 0)).keys(),
  );

  return (
    <>
      {participants.map((participant) => (
        <User
          key={participant.id}
          username={participant.username}
          image={`/images/${participant.avatar}.png`}
          status={'online'}
          score={participant.score}
        />
      ))}
      {skeltonUsers.map((_, index) => (
        <SkeltonUser key={index} />
      ))}
    </>
  );
};

export default Participants;
