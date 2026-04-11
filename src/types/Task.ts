export type Task = {
  id: number;
  date: string;
  type: string;
  content: string;
  runTimeMinute?: number;
}

export const taskHeaderToCsv = (task: Task) => {
  return Object.entries(task)
  .map((value) => value[0])
  .join(",")
}

export const taskToCsv = (task: Task) => {
  return Object.entries(task)
  .map(([key, value]) => key === "date" ? fromLocaleTimeString(value as string) : value)
  .join(",")
}

export const toLocaleTimeString = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = padZero((d.getMonth() + 1).toString(), 2);
  const day = padZero(d.getDate().toString(), 2);
  const hour = padZero(d.getHours().toString(), 2);
  const minute = padZero(d.getMinutes().toString(), 2);
  return `${year}/${month}/${day} ${hour}:${minute}`;
};
export const fromLocaleTimeString = (localeDate: string) => {
  const splited = localeDate.replace(/[ :]/g, "/").split("/");
  const year = splited[0];
  const month = splited[1];
  const day = splited[2];
  const hour = splited[3];
  const minute = splited[4];
  
  const dateString = `${year}/${padZero(month, 2)}/${padZero(day, 2)} ${padZero(
      hour,
      2
    )}:${padZero(minute, 2)}:00`;
  console.log(dateString);
  return new Date(dateString).toISOString();
};

export const padZero = (target: string, digit: number) =>
  `000000000${target}`.slice(-digit);

