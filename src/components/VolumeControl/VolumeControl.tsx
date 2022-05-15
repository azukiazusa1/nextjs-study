import React from 'react';

import VolumeOff from '@/components/icons/VolumeOff';
import VolumeUp from '@/components/icons/VolumeUp';

type Props = {
  volume: number;
  onVolumeChange: (volume: number) => void;
};
const VolumeControl: React.FC<Props> = ({ volume, onVolumeChange }) => {
  const handleClick = () => {
    onVolumeChange(volume === 0 ? 1 : 0);
  };

  return (
    <div className="flex felx-col items-center">
      <button className="cursor-pointer w-6" onClick={handleClick}>
        {volume > 0 ? <VolumeUp data-testid="volume-up" /> : <VolumeOff data-testid="volume-off" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="ml-2 w-24"
      />
    </div>
  );
};

export default VolumeControl;
