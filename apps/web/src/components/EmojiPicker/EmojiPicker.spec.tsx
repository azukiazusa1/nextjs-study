import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { REQ_EVENTS } from 'models';
import React from 'react';

import { SocketContext } from '@/context/socket';

import EmojiPicker from './EmojiPicker';

const dummySocket = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
} as any;

describe('components/EmojiPicker', () => {
  const Template: React.FC = () => (
    <SocketContext.Provider value={dummySocket}>
      <EmojiPicker />
    </SocketContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const { container } = render(<Template />);
    expect(container).toMatchSnapshot();
  });

  test('絵文字を選択したら、その絵文字を表示する', async () => {
    render(<Template />);
    const emoji = screen.getByRole('button', { name: '👍' });

    await userEvent.click(emoji);

    expect(dummySocket.emit).toBeCalledWith(REQ_EVENTS.SEND_MESSAGE, '👍');
  });
});
