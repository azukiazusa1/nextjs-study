import React from 'react';

type Props = {
  /**
   * 画像のURL
   */
  src: string;
  /**
   * 画像の代替テキスト
   */
  alt: string;
  /**
   * 現在オンライン状態かどうか
   * @default ''
   */
  status?: 'online' | 'offline' | '';
  className?: string;
};

const Avatar: React.FC<Props> = ({ className, src, alt, status = '' }) => {
  return (
    <div className={`avatar ${status} ${className}`}>
      <div className="w-12 h-12 rounded-full">
        <img src={src} alt={alt} width="48px" height="48px" />
      </div>
    </div>
  );
};

export default Avatar;
