export type Task = {
  id: number;
  date: string;
  type: string;
  content: string;
}

export const taskHeaderToCsv = (task: Task) => {
  return Object.entries(task)
  .map((value) => value[0])
  .join(",")
}

export const taskToCsv = (task: Task) => {
  return Object.entries(task)
  .map((value) => value[1])
  .join(",")
}

