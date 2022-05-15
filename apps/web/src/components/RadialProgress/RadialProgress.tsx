import React from 'react';

type Props = {
  /**
   * 進捗状況
   */
  progress: number;
  /**
   * プログレスバーのサイズ
   * @default 16rem
   */
  size?: string;
  /**
   * プログレスバーの太さ
   * @default 0.5rem
   */
  thickness?: string;
  children: React.ReactNode;
};

const RadialProgress: React.FC<Props> = ({
  progress,
  size = '16rem',
  thickness = '0.5rem',
  children,
}) => {
  return (
    <div
      className="radial-progress text-main"
      style={
        { '--value': progress, '--size': size, '--thickness': thickness } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default RadialProgress;
