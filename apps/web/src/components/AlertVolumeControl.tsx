import useAlert from '@/hooks/useAlert';

import VolumeControl from './VolumeControl/VolumeControl';

const AlertVolumeControl = () => {
  const { volume, setVolume } = useAlert();

  return <VolumeControl volume={volume} onVolumeChange={setVolume} />;
};

export default AlertVolumeControl;
