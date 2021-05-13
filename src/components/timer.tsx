import dayjs, { Dayjs } from 'dayjs';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import useNewTimer from '../hooks/useTimer';

type TimerType = {
  onTimeTick?: (time: Dayjs) => void;
  hideJSX?: boolean;
  fixed?: boolean;
  className?: string;
};

const Timer: FunctionalComponent<TimerType> = (props) => {
  const { onTimeTick, hideJSX, fixed, className } = props;
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
    <time
      className={`appTimer ${fixed ? 'fixed' : ''} ${className || ''}`}
      id="appTimerId"
      dateTime={timer.format()}
    >
      {timer.format('LL LTS')}
    </time>
  );
};

export default Timer;
