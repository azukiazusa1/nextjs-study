import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import useCountdown from './useCountdown';
jest.useFakeTimers();

describe('hooks/useCountdown', () => {
  test(`経過時間が0秒の時
    作業時間である
    minutes: 25
    seconds: 0
    remainngPercentage: 100
  `, () => {
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(0, jest.fn());
    });
    expect(result.current.minutes).toBe(25);
    expect(result.current.seconds).toBe(0);
    expect(result.current.remainngPercentage).toBe(100);
    expect(result.current.isRestTime).toBe(false);
  });

  test(`経過時間が25分20秒の時
    休憩時間である
    minutes: 4
    seconds: 40
    remainngPercentage: 93
  `, () => {
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(25 * 60 * 1000 + 20 * 1000, jest.fn());
    });
    expect(result.current.minutes).toBe(4);
    expect(result.current.seconds).toBe(40);
    expect(Math.floor(result.current.remainngPercentage)).toBe(93);
    expect(result.current.isRestTime).toBe(true);
  });

  test(`経過時間が1時間18分10秒の時
    作業時間である
    minutes: 6
    seconds: 50
    remainngPercentage: 27
  `, () => {
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(1 * 60 * 60 * 1000 + 18 * 60 * 1000 + 10 * 1000, jest.fn());
    });
    expect(result.current.minutes).toBe(6);
    expect(result.current.seconds).toBe(50);
    expect(Math.floor(result.current.remainngPercentage)).toBe(27);
    expect(result.current.isRestTime).toBe(false);
  });

  test('時間が経過すると、経過時間が更新されること', () => {
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(0, jest.fn());
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.minutes).toBe(24);
    expect(result.current.seconds).toBe(59);
    expect(Math.floor(result.current.remainngPercentage)).toBe(99);
    expect(result.current.isRestTime).toBe(false);
  });

  test('時間が経過したことにより、作業時間 → 休憩時間となった時コールバック関数が呼ばれる', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(0, callback);
    });

    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(callback).toHaveBeenCalledWith(false);
    expect(result.current.isRestTime).toBe(true);
  });

  test('時間が経過したことにより、休憩時間 → 作業時間となった時コールバック関数が呼ばれる', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useCountdown());
    act(() => {
      result.current.startTimer(25 * 60 * 1000 + 20 * 1000, callback);
    });

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(callback).toHaveBeenCalledWith(true);
    expect(result.current.isRestTime).toBe(false);
  });
});
