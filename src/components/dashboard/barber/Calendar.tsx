// import {Calendar} from "@heroui/calendar";
// import React from "react";
// import {parseDate} from "@internationalized/date";
// import styles from "../../../styles/calendar.module.css";

// export default function App() {
//   let [value, setValue] = React.useState(parseDate("2024-03-07"));

//   return <Calendar aria-label="Date (Controlled)" value={value} onChange={setValue} className={styles.calendar} />;
// }

import { Calendar } from "@heroui/calendar";
import React from "react";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import styles from "../../../styles/calendar.module.css";

export default function App() {
  let [value, setValue] = React.useState(parseDate("2024-03-07"));

  return (
    <div className={styles.calendarContainer}>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Agendamento</h2>
      <Calendar
        aria-label="Calendário de Agendamentos"
        value={value}
        onChange={setValue}
        className={styles.calendar}
        minValue={today(getLocalTimeZone())}
      />
    </div>
  );
}
