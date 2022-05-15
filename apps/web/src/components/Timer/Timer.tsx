import React from 'react';

type Props = {
  minutes: number;
  seconds: number;
};

const Timer: React.FC<Props> = ({ minutes, seconds }) => {
  const padMinutes = String(minutes).padStart(2, '0');
  const padSeconds = String(seconds).padStart(2, '0');

  const minutesStyle = {
    '--value': padMinutes,
  } as React.CSSProperties;

  const secondsStyle = {
    '--value': padSeconds,
  } as React.CSSProperties;

  return (
    <span className="countdown font-mono text-6xl">
      <span style={minutesStyle} data-testid="minutes">
        {padMinutes}
      </span>
      :
      <span data-testid="seconds" style={secondsStyle}>
        {padSeconds}
      </span>
    </span>
  );
};

export default Timer;
