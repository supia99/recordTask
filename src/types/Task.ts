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

export const toLocaleTimeString = (date: string) =>
  `${new Date(date).toLocaleDateString()} ${new Date(
    date
  ).toLocaleTimeString()}`;
export const fromLocaleTimeString = (localeDate: string) => {
  const splited = localeDate.replace(/[ :]/g, "/").split("/");
  const year = splited[0];
  const dateString = `${year}/${padZero(splited[1], 2)}/${padZero(splited[2], 2)} ${padZero(
      splited[3],
      2
    )}:${padZero(splited[4], 2)}:${padZero(splited[5], 2)}`
    console.log(dateString)
  return new Date(
    dateString
  ).toISOString();
};

export const padZero = (target: string, digit: number) =>
  `000000000${target}`.slice(-digit);

