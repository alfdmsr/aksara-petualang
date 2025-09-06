import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(tz);
export const todayJakarta = () =>
  dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");
export const nowEpochSec = () =>
  Math.floor(dayjs().tz("Asia/jakarta").valueOf() / 1000);
