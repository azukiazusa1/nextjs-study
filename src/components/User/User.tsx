import React from 'react';

import Avatar from '@/components/Avatar/Avatar';

type Props = {
  className?: string;
  username: string;
  image: string;
  status: 'online' | 'offline' | '';
  score: number;
};

const User: React.FC<Props> = ({ className = '', username, image, status, score }: Props) => {
  return (
    <div className={`flex max-w-60 ${className}`}>
      <Avatar status={status} src={image} alt={username} />
      <div className="flex flex-col ml-4 space-y-2">
        <div className="truncate">{username}</div>
        <div>🍅 × {score}</div>
      </div>
    </div>
  );
};

export default User;
