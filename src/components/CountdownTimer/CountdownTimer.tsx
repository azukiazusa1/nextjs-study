import React from 'react';

import RadialProgress from '@/components/RadialProgress/RadialProgress';
import Timer from '@/components/Timer/Timer';
import useCountdown from '@/hooks/useCountdown';

type Props = {
  time: number;
};

const CountdownTimer: React.FC<Props> = ({ time }) => {
  const { minutes, seconds, remainngPercentage } = useCountdown(time);

  return (
    <RadialProgress progress={remainngPercentage}>
      <div className="text-primary-content">
        <Timer minutes={minutes} seconds={seconds} />
      </div>
    </RadialProgress>
  );
};

export default CountdownTimer;
