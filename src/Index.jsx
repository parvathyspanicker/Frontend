import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/Index.css";

function Index() {
  const [tasks, setTasks] = useState([]); // Task list
  const [newTask, setNewTask] = useState(""); // New task input

  // Fetch tasks from backend when the component loads
  useEffect(() => {
    axios
      .get("http://localhost:3001/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const handleAddTask = () => {
    if (newTask.trim() === "") return; // Prevent empty task

    axios
      .post("http://localhost:3001/tasks", { text: newTask, completed: false })
      .then((response) => {
        setTasks([...tasks, response.data]); // Update task list
        setNewTask(""); // Clear input field
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Toggle task completion
  const handleToggleTask = (id, completed) => {
    axios
      .put(`http://localhost:3001/tasks/${id}`, { completed: !completed })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, completed: !completed } : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    axios
      .delete(`http://localhost:3001/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id)); // Remove from UI
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h2>My Tasks ✅</h2>

        <div className="input-section">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task._id, task.completed)}
              />
              <span className={`task-text ${task.completed ? "completed" : ""}`}>
                {task.text}
              </span>
              <div className="buttons">
                <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>

        <p className="status">
          Tasks Completed: <span>{tasks.filter(task => task.completed).length}</span> |
          Pending: <span>{tasks.filter(task => !task.completed).length}</span>
        </p>
      </div>
    </div>
  );
}

export default Index;
