import { useEffect, useState } from 'preact/hooks';
import { dateFormat } from 'src/dateFormat';

function useNewTimer() {
  const [date, setDate] = useState(dateFormat());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(dateFormat());
  }

  return date;
}

export default useNewTimer;
