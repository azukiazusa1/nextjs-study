import { render, screen } from '@testing-library/react';
import React from 'react';

import Timer from './Timer';

describe('components/Timer', () => {
  it('should render', () => {
    render(<Timer minutes={24} seconds={11} />);
    expect(screen.getByTestId('minutes')).toHaveTextContent('24');
    expect(screen.getByTestId('seconds')).toHaveTextContent('11');
  });
  it('should render with 0 seconds', () => {
    render(<Timer minutes={24} seconds={0} />);
    expect(screen.getByTestId('minutes')).toHaveTextContent('24');
    expect(screen.getByTestId('seconds')).toHaveTextContent('00');
  });
  it('should render with 0 minutes', () => {
    render(<Timer minutes={0} seconds={11} />);
    expect(screen.getByTestId('minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('seconds')).toHaveTextContent('11');
  });
});
