import { useEffect, useState } from "react";
import "./App.css";
import { Task, taskHeaderToCsv, taskToCsv } from "./types/Task";

const TASK_TYPE_OPTIONS = [
  { value: "other", display: "その他" },
  { value: "us", display: "US" },
  { value: "review", display: "レビュー" },
  { value: "alert", display: "アラート対応" },
  { value: "maintenance", display: "保守対応" },
  { value: "follow", display: "フォロー" },
];

function App() {
  const [time, setTime] = useState<string>(new Date().toLocaleDateString());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finishDate, setFinishDate] = useState<string>("");

  const localStorageKey = "tasks";

  // timer用
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1_000);
    return () => clearInterval(timerId);
  }, []);

  const addTask = () => {
    const addId = tasks.length
      ? tasks.reduce(
          (current, pTask) =>
            (current = current < pTask.id ? pTask.id : current),
          0
        ) + 1
      : 0;
    setTasks([
      ...tasks,
      {
        id: addId,
        date: new Date().toISOString(),
        type: TASK_TYPE_OPTIONS[0].value,
        content: "",
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [id, columnHeader] = e.target.id.split(":");
    const copiedTasks = [...tasks];
    const targetTask = copiedTasks[Number(id)];
    const value = e.target?.value;
    if (value) {
      targetTask[columnHeader] = value;
      setTasks(copiedTasks);
    }
  };

  const deleteColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("delete column");
    const [id] = e.target.id.split(":");
    const copied = [...tasks].filter((task) => task.id !== Number(id));
    setTasks(copied);
  };

  const sort = () => {
    const tmpTasks = [...tasks].sort(
      (a, b) => exchangeDate(a) - exchangeDate(b)
    );
    setTasks(tmpTasks);
  };

  const exchangeDate = (task: Task) => {
    const d = new Date(task.date).valueOf();
    const n = Number(d);
    return n;
  };

  const registerFinishTime = () => {
    setFinishDate(new Date().toISOString());
  };

  return (
    <>
      <h1>タスク記録アプリ</h1>
      <div className="menu">現在時刻: {time}</div>
      <div className="menu">
        <input
          type="button"
          value="追加"
          className="add-button"
          onClick={() => addTask()}
        />

        <input
          type="button"
          className="add-button"
          value="ダウンロード"
          onClick={() => download()}
        />

        <input
          type="button"
          className="add-button"
          value="クリア"
          onClick={() => clear()}
        />

        <input
          type="button"
          className="add-button"
          value="一時保存"
          onClick={() => save()}
        />

        <input
          type="button"
          className="add-button"
          value="一時読み込み"
          onClick={() => importFromLocalStroage()}
        />

        <input
          type="button"
          className="add-button"
          value="ソート"
          onClick={() => sort()}
        />
      </div>

      <table className="task-table">
        <thead className="task-table">
          <tr>
            <th scope="col" className="task-table-content">
              開始時刻
            </th>
            <th scope="col" className="task-table-content">
              分類
            </th>
            <th scope="col" className="task-table-content ">
              内容
            </th>
            <th scope="col" className="task-table-content">
              削除
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr key={task.id}>
                <td className="task-table-content">
                  <input
                    defaultValue={task.date}
                    onBlur={(e) => onInputChange(e)}
                    id={task.id + ":date"}
                    className="date-input"
                  />
                </td>
                <td className="task-table-content">
                  <select
                    defaultValue={task.type}
                    onBlur={(e) => onInputChange(e)}
                    className="type-select"
                    id={task.id + ":type"}
                  >
                    {TASK_TYPE_OPTIONS.map((typeOption) => {
                      return (
                        <option value={typeOption.value} id={typeOption.value}>
                          {typeOption.display}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="task-table-content">
                  <input
                    defaultValue={task.content}
                    onBlur={(e) => onInputChange(e)}
                    id={task.id + ":content"}
                    className="content-input"
                  />
                </td>
                <td className="task-table-content">
                  <input
                    type="button"
                    onClick={(e) => deleteColumn(e)}
                    id={task.id + ":delete"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="footer">
        <input
          type="button"
          value="終わり"
          className="add-button"
          onClick={() => registerFinishTime()}
        />
        {finishDate}
      </div>
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
