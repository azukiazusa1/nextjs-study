import React from 'react';

import Avatar from '@/components/Avatar/Avatar';

type Props = {
  className?: string;
  username: string;
  image: string;
  status: 'online' | 'offline' | '';
  quantity: number;
};

const User: React.FC<Props> = ({ className, username, image, status, quantity }: Props) => {
  return (
    <div className={`flex ${className}`}>
      <Avatar status={status} src={image} alt={username} />
      <div className="flex flex-col ml-4">
        <div>{username}</div>
        <div>🍅 × {quantity}</div>
      </div>
    </div>
  );
};

export default User;
