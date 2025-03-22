import { useEffect, useState } from "react";
import "./App.css";
import { Task } from "./types/Task";

function App() {
  const [time, setTime] = useState<string>(new Date().toLocaleDateString());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [testContent, setTestContent] = useState<string>("");

  // timer用
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1_000);
    return () => clearInterval(timerId);
  }, []);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        date: new Date().toLocaleDateString(),
        time: time,
        content: "new task!!!",
      },
    ]);
  };

  const download = () => {
    tasks.forEach((element) => {
      console.log(`time: ${element.time}`);
    });
    const content = tasks.reduce(
      (current, task) =>
        current +
        Object.entries(task)
          .map((value) => value[1])
          .join(",") +
        "\n",
      ""
    );
    setTestContent(content);
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
              <tr key={task.time}>
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
      {testContent}
    </>
  );
}

export default App;
