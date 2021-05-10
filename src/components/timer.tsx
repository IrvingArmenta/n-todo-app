import dayjs, { Dayjs } from 'dayjs';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import useNewTimer from '../hooks/useTimer';

type TimerType = {
  onTimeTick?: (time: Dayjs) => void;
  hideJSX?: boolean;
};

const Timer: FunctionalComponent<TimerType> = (props) => {
  const { onTimeTick, hideJSX } = props;
  const timer = useNewTimer(dayjs().locale('ja'));

  useEffect(() => {
    if (onTimeTick) {
      onTimeTick(timer);
    }
  }, [timer, onTimeTick]);

  if (hideJSX) {
    return null;
  }

  return (
    <span className="appTimer" id="appTimerId">
      {timer.format('LL LTS')}
    </span>
  );
};

export default Timer;
