import React from 'react';

import Avatar from '@/components/Avatar/Avatar';

type Props = {
  className?: string;
  username: string;
  image: string;
  status: 'online' | 'offline' | '';
  score: number;
  message?: string;
};

const User: React.FC<Props> = ({
  className = '',
  username,
  image,
  status,
  score,
  message = '',
}: Props) => {
  return (
    <div className={`flex max-w-60 ${className}`}>
      <div className={`tooltip ${!!message && 'tooltip-open'} tooltip-primary`} data-tip={message}>
        <Avatar status={status} src={image} alt={username} />
      </div>
      <div className="flex flex-col ml-4 space-y-2">
        <div className="truncate">{username}</div>
        <div>
          🍅 ×<span>{score}</span>
        </div>
      </div>
    </div>
  );
};

export default User;
