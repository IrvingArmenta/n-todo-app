import { clsx } from '@utils';
import type { Dayjs } from 'dayjs';
import type { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import useNewTimer from '../hooks/useTimer';

type TimerType = {
  onTimeTick?: (time: Dayjs) => void;
  fixed?: boolean;
  className?: string;
};

const Timer: FunctionalComponent<TimerType> = (props) => {
  const { onTimeTick, fixed, className } = props;
  const timer = useNewTimer();

  useEffect(() => {
    if (onTimeTick) {
      onTimeTick(timer);
    }
  }, [timer, onTimeTick]);

  return (
    <time
      className={clsx('appTimer', fixed && 'fixed', className)}
      id="appTimerId"
      dateTime={timer.format()}
    >
      {timer.format('LL LTS')}
    </time>
  );
};

export default Timer;
