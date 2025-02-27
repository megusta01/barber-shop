// import { Calendar } from "@heroui/calendar";
// import { today, getLocalTimeZone } from "@internationalized/date";
// import styles from "../../../styles/calendar.module.css";
// export default function App() {
//   return (
//     <div className={styles.calendarContainer}>
//       <Calendar
//         className={styles.calendar}
//         aria-label="Date (Min Date Value)"
//         defaultValue={today(getLocalTimeZone())}
//         minValue={today(getLocalTimeZone())}
//       />
//     </div>
//   );
// }

import { Calendar } from "@heroui/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import styles from "../../../styles/calendar.module.css";

export default function App() {
  return (
    <>
      <Calendar
        className={styles.calendar}
        aria-label="Calendário"
        defaultValue={today(getLocalTimeZone())}
        minValue={today(getLocalTimeZone())}
      />
    </>
  );
}
