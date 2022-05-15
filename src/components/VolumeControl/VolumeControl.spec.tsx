import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import VolumeControl from './VolumeControl';

describe('components/VolumeControl', () => {
  it('should render correctly', () => {
    const { container } = render(<VolumeControl volume={0.5} onVolumeChange={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  test('スライダー を操作したとき、onVolumeChange が呼ばれること', async () => {
    const onVolumeChange = jest.fn();
    render(<VolumeControl volume={0.5} onVolumeChange={onVolumeChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '0.1' } });
    expect(onVolumeChange).toHaveBeenCalledWith(0.1);
  });

  test('ボリュームが0の場合、ボリュームオフアイコンが表示されること', async () => {
    const onVolumeChange = jest.fn();
    render(<VolumeControl volume={0} onVolumeChange={onVolumeChange} />);
    expect(screen.getByLabelText('Volume off')).toBeInTheDocument();
  });

  test('ボリュームが0より上の場合、ボリュームオンアイコンが表示されること', async () => {
    const onVolumeChange = jest.fn();
    render(<VolumeControl volume={0.1} onVolumeChange={onVolumeChange} />);
    expect(screen.getByLabelText('Volume up')).toBeInTheDocument();
  });

  test('ボリュームオフアイコンをクリックしたとき、ボリュームが1になること', async () => {
    const onVolumeChange = jest.fn();
    render(<VolumeControl volume={0} onVolumeChange={onVolumeChange} />);
    const icon = screen.getByLabelText('Volume off');
    fireEvent.click(icon);
    expect(onVolumeChange).toHaveBeenCalledWith(1);
  });

  test('ボリュームオンアイコンをクリックしたとき、ボリュームが0になること', async () => {
    const onVolumeChange = jest.fn();
    render(<VolumeControl volume={0.1} onVolumeChange={onVolumeChange} />);
    const icon = screen.getByLabelText('Volume up');
    fireEvent.click(icon);
    expect(onVolumeChange).toHaveBeenCalledWith(0);
  });
});
