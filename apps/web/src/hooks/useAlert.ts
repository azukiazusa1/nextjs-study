import { atom, useAtom } from "jotai";
import useSound from "use-sound";

import alertMp3 from "../../public/sounds/alert.mp3";

type UseAlertReturn = {
  /**
   * アラートの音量
   */
  volume: number;
  /**
   * アラートの音量を更新する
   * @param volume アラートの音量
   */
  setVolume: (volume: number) => void;
  /**
   * アラートを鳴らす関数
   */
  play: () => void;
};

type UseAlert = () => UseAlertReturn;

const volumeAtom = atom(1);

const useAlert: UseAlert = () => {
  const [volume, setVolume] = useAtom(volumeAtom);
  const [play] = useSound(alertMp3, {
    volume,
  });

  return {
    volume,
    setVolume,
    play,
  };
}
export default useAlert;