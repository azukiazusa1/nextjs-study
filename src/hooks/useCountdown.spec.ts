import { act, renderHook } from '@testing-library/react';

import useCountdown from './useCountdown';

jest.useFakeTimers();

describe('hooks/useCountdown', () => {
  test('time に5分を指定すると[5, 0, 3000000, false]が変える', () => {
    const { result } = renderHook(() => useCountdown(300000));

    expect(result.current.minutes).toBe(5);
    expect(result.current.seconds).toBe(0);
    expect(result.current.milliseconds).toBe(300000);
    expect(result.current.end).toBe(false);
    expect(Math.round(result.current.remainngPercentage)).toBe(100);
  })

  test('10秒経過すると、[4, 50, 29000, false]が返る', () => {
    const { result } = renderHook(() => useCountdown(300000));

    act((() => {
      jest.advanceTimersByTime(10000);
    }))

    expect(result.current.minutes).toBe(4);
    expect(result.current.seconds).toBe(50);
    expect(result.current.milliseconds).toBe(290000);
    expect(result.current.end).toBe(false);
    expect(Math.round(result.current.remainngPercentage)).toBe(97);
  })

  test('3分経過すると、[2, 0, 120000]が返る', () => {
    const { result } = renderHook(() => useCountdown(300000));

    act((() => {
      jest.advanceTimersByTime(180000);
    }))

    expect(result.current.minutes).toBe(2);
    expect(result.current.seconds).toBe(0);
    expect(result.current.milliseconds).toBe(120000);
    expect(result.current.end).toBe(false);
    expect(Math.round(result.current.remainngPercentage)).toBe(40);
  })

  test('カウントダウンが終了したら、[0, 0, 0, true]が返る', () => {
    const { result } = renderHook(() => useCountdown(300000));

    act((() => {
      jest.advanceTimersByTime(330000);
    }))

    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.milliseconds).toBe(0);
    expect(result.current.end).toBe(true);
    expect(Math.round(result.current.remainngPercentage)).toBe(0);
  })
})