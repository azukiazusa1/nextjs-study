import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { REQ_EVENTS } from 'models';
import React from 'react';

import { SocketContext } from '@/context/socket';

import JoinRoomForm from './JoinRoomForm';

describe('hooks/useCountdown', () => {
  const mockSocket: any = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  } as any;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SocketContext.Provider value={mockSocket}>{children}</SocketContext.Provider>
  );

  beforeEach(() => {
    localStorage.clear();
    mockSocket.emit.mockReset();
  });

  test('名前を入力してサーバーへ入室リクエスト送信すること', async () => {
    render(<JoinRoomForm />, {
      wrapper,
    });

    await userEvent.type(screen.getByLabelText('名前'), 'test');
    await userEvent.click(screen.getByRole('button', { name: 'JOIN👏' }));

    expect(mockSocket.emit).toHaveBeenCalledWith(REQ_EVENTS.JOIN_ROOM, {
      username: 'test',
      avatar: '1',
      score: 0,
    });
  });

  it('should render correctly', () => {
    const { container } = render(<JoinRoomForm />, {
      wrapper,
    });
    expect(container).toMatchSnapshot();
  });

  test('名前を入力していない場合、入室リクエストを送信せずエラーメッセージを表示する', async () => {
    render(<JoinRoomForm />, {
      wrapper,
    });

    await userEvent.click(screen.getByRole('button', { name: 'JOIN👏' }));

    expect(mockSocket.emit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('名前を入力してください');
  });

  test('アバターをクリックして選択する', async () => {
    render(<JoinRoomForm />, {
      wrapper,
    });

    await userEvent.click(screen.getByAltText('フラットデザインのキツネ'));
    await userEvent.type(screen.getByLabelText('名前'), 'test');
    await userEvent.click(screen.getByRole('button', { name: 'JOIN👏' }));

    expect(mockSocket.emit).toHaveBeenCalledWith(REQ_EVENTS.JOIN_ROOM, {
      username: 'test',
      avatar: '5',
      score: 0,
    });
  });

  test('サーバーへリクエスト後 localStorage に保存する', async () => {
    render(<JoinRoomForm />, {
      wrapper,
    });

    await userEvent.click(screen.getByAltText('フラットデザインのキツネ'));
    await userEvent.type(screen.getByLabelText('名前'), 'test');
    await userEvent.click(screen.getByRole('button', { name: 'JOIN👏' }));

    expect(mockSocket.emit).toHaveBeenCalledWith(REQ_EVENTS.JOIN_ROOM, {
      username: 'test',
      avatar: '5',
      score: 0,
    });

    expect(localStorage.getItem('username')).toBe('test');
    expect(localStorage.getItem('avatar')).toBe('5');
  });

  test('初期値に localStorage の値を使用する', async () => {
    localStorage.setItem('username', 'username');
    localStorage.setItem('avatar', '3');
    localStorage.setItem('score', '20');

    render(<JoinRoomForm />, {
      wrapper,
    });

    await userEvent.click(screen.getByRole('button', { name: 'JOIN👏' }));

    expect(mockSocket.emit).toHaveBeenCalledWith(REQ_EVENTS.JOIN_ROOM, {
      username: 'username',
      avatar: '3',
      score: 20,
    });
  });
});
