import { useEffect, useState } from "react";
import "./App.css";
import { Task, taskHeaderToCsv, taskToCsv } from "./types/Task";

function App() {
  const [time, setTime] = useState<string>(new Date().toLocaleDateString());
  const [tasks, setTasks] = useState<Task[]>([]);

  const localStorageKey = "tasks";

  // timer用
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1_000);
    return () => clearInterval(timerId);
  }, []);

  const addTask = () => {
    const maxId = tasks.reduce(
      (current, pTask) => (current = current < pTask.id ? pTask.id : current),
      0
    );
    setTasks([
      ...tasks,
      {
        id: maxId + 1,
        date: new Date().toLocaleDateString(),
        time: time,
        content: "new task!!!",
      },
    ]);
  };

  const download = () => {
    if (tasks.length) {
      const content = tasksToCsv(tasks);
      const blob = new Blob([content], { type: "text/plain" });
      const jsonURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = jsonURL;
      link.setAttribute("download", "output.txt");
      link.click();
      document.body.removeChild(link);
    }
  };

  const clear = () => {
    setTasks([]);
  };

  const save = () => {
    localStorage.setItem(localStorageKey, tasksToCsv(tasks));
  };

  const importFromLocalStroage = () => {
    const localStorageContent = localStorage.getItem(localStorageKey);
    if (localStorageContent) {
      setTasks(csvToTasks(localStorageContent));
    }
  };

  return (
    <>
      <h1>タスク記録アプリ</h1>
      <div className="register">
        <div>現在時刻: {time}</div>
        <input
          type="button"
          name="ADD"
          value="ADD"
          className="add-button"
          onClick={() => addTask()}
        />

        <input
          type="button"
          className="add-button"
          value="download"
          onClick={() => download()}
        />

        <input
          type="button"
          className="add-button"
          value="clear"
          onClick={() => clear()}
        />

        <input
          type="button"
          className="add-button"
          value="save"
          onClick={() => save()}
        />

        <input
          type="button"
          className="add-button"
          value="importFromLocalStorage"
          onClick={() => importFromLocalStroage()}
        />
      </div>

      <table className="task-table">
        <thead className="task-table">
          <tr>
            <th scope="col" className="task-table-content">
              日付
            </th>
            <th scope="col" className="task-table-content">
              時間
            </th>
            <th scope="col" className="task-table-content">
              内容
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr key={task.id}>
                <td className="task-table-content">
                  <input value={task.date} />
                </td>
                <td className="task-table-content">
                  <input value={task.time} />
                </td>
                <td className="task-table-content">
                  <input value={task.content} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default App;

const tasksToCsv = (tasks: Task[]) => {
  const header = taskHeaderToCsv(tasks[0]) + "\n";
  return tasks.reduce(
    (current, task) => current + taskToCsv(task) + "\n",
    header
  );
};

const csvToTasks = (csv: string): Task[] => {
  const lows = csv.split("\n");
  const columns = lows[0].split(",");
  const bodyLows = lows.slice(1).filter((l) => l !== "");

  return bodyLows.map((bodyLow) =>
    columns.reduce((acc, column, index) => {
      const datas = bodyLow.split(",");
      return { ...acc, [column]: datas[index] };
    }, {})
  ) as Task[];
};
