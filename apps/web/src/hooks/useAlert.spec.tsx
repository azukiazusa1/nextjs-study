import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import useAlert from './useAlert';

describe('hooks/useAlert', () => {
  test('Volumeが更新されること', () => {
    const { result } = renderHook(() => useAlert());
    act(() => {
      result.current.setVolume(0.5);
    });
    expect(result.current.volume).toBe(0.5);
  });
});
