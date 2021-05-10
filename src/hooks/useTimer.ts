import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'preact/hooks';
require('dayjs/locale/ja');
const localizedFormat = require('dayjs/plugin/localizedFormat');
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
    setDate(dayjs().locale('ja'));
  }

  return date;
}

export default useNewTimer;
