import { renderHook, waitFor } from '@testing-library/react';
import { Participant } from 'models';
import { act } from 'react-dom/test-utils';

import useParticipants from './useParticipants';

describe('hooks/useParticipants', () => {
  const participants: Participant[] = [
    {
      roomId: 'roomId',
      id: '1',
      username: 'test1',
      avatar: '',
      score: 0,
    },
    {
      roomId: 'roomId',
      id: '2',
      username: 'test2',
      avatar: '',
      score: 5,
    },
  ];

  test('参加者一覧を更新できること', () => {
    const { result } = renderHook(() => useParticipants());
    act(() => {
      result.current.setParticipants(participants);
    });

    expect(result.current.participants).toEqual(participants);
  });

  test('参加者全員に対してスコアが加算されること', async () => {
    const { result } = renderHook(() => useParticipants());
    act(() => {
      result.current.setParticipants(participants);
      result.current.updateParticipantsScore(10);
    });

    expect(result.current.participants).toEqual([
      {
        roomId: 'roomId',
        id: '1',
        username: 'test1',
        avatar: '',
        score: 10,
      },
      {
        roomId: 'roomId',
        id: '2',
        username: 'test2',
        avatar: '',
        score: 15,
      },
    ]);
  });

  test('参加者が追加されること', async () => {
    const { result } = renderHook(() => useParticipants());
    act(() => {
      result.current.setParticipants(participants);
      result.current.addParticipant({
        roomId: 'roomId',
        id: '3',
        username: 'test3',
        avatar: '',
        score: 0,
      });
    });

    expect(result.current.participants).toEqual([
      ...participants,
      {
        roomId: 'roomId',
        id: '3',
        username: 'test3',
        avatar: '',
        score: 0,
      },
    ]);
  });

  test('参加者が退出されること', async () => {
    const { result } = renderHook(() => useParticipants());

    act(() => {
      result.current.setParticipants(participants);
      result.current.removeParticipant('2');
    });

    await waitFor(() => {
      expect(result.current.participants).toEqual([
        {
          roomId: 'roomId',
          id: '1',
          username: 'test1',
          avatar: '',
          score: 0,
        },
      ]);
    });
  });
});
