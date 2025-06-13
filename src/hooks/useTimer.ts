import dayjs, { type Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useState } from 'preact/hooks';
dayjs.extend(localizedFormat);

function useNewTimer(currentDate: Dayjs) {
  const [date, setDate] = useState(currentDate);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(dayjs());
  }

  return date;
}

export default useNewTimer;
