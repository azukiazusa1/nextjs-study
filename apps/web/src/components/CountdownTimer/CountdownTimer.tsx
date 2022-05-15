import React from 'react';

import RadialProgress from '@/components/RadialProgress/RadialProgress';
import Timer from '@/components/Timer/Timer';
import useCountdown from '@/hooks/useCountdown';

const CountdownTimer: React.FC = () => {
  const { minutes, seconds, remainngPercentage } = useCountdown();

  return (
    <RadialProgress progress={remainngPercentage}>
      <div className="text-primary-content">
        <Timer minutes={minutes} seconds={seconds} />
      </div>
    </RadialProgress>
  );
};

export default CountdownTimer;
