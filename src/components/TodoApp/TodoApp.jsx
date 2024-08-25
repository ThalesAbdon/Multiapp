import { useState, useEffect } from "react";
import styled from "styled-components";

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  margin: 50px auto;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

const TaskItem = styled.li`
  background: #f9f9f9;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f1f1f1;
  }

  button {
    margin-left: 10px;
    background: transparent;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: darkred;
    }
  }
`;

const EditInput = styled.input`
  margin-left: 10px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 60%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SaveButton = styled.button`
  padding: 6px 12px;
  margin-left: 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: darkgreen;
  }
`;

// Componente principal do TodoApp
export const TodoApp = () => {
  const [task, setTask] = useState(""); // Estado para a nova tarefa
  const [tasks, setTasks] = useState([]); // Estado para a lista de tarefas
  const [editingTaskId, setEditingTaskId] = useState(null); // Estado para a tarefa em edição
  const [editingTaskText, setEditingTaskText] = useState(""); // Estado para o texto da tarefa em edição

  // Carrega as tarefas do localStorage quando o componente é montado
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Atualiza o localStorage sempre que a lista de tarefas é alterada
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Função para adicionar uma nova tarefa
  const addTask = () => {
    if (task && !tasks.some((t) => t.text.toLowerCase() === task.toLowerCase())) {
      const newTask = { id: Date.now(), text: task.toLowerCase() };
      setTasks([...tasks, newTask]);
      setTask("");
    } else {
      alert("Task already exists or is empty!");
    }
  };

  // Função para deletar uma tarefa
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    // Se a última tarefa for removida, limpamos o localStorage
    if (updatedTasks.length === 0) {
      localStorage.removeItem("tasks");
    }
  };

  // Função para iniciar a edição de uma tarefa
  const editTask = (id, text) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  // Função para salvar a tarefa editada
  const updateTask = (id) => {
    if (editingTaskText && !tasks.some((t) => t.text.toLowerCase() === editingTaskText.toLowerCase())) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: editingTaskText.toLowerCase() } : task
        )
      );
      setEditingTaskId(null);
      setEditingTaskText("");
    } else {
      alert("Task name already exists or is empty!");
    }
  };

  return (
    <Container>
      <Title>Todo App</Title>
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <Button onClick={addTask}>Add Task</Button>
      <TaskList>
        {tasks.map((task) => (
          <TaskItem key={task.id}>
            {editingTaskId === task.id ? (
              <>
                <EditInput
                  type="text"
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                />
                <SaveButton onClick={() => updateTask(task.id)}>Save</SaveButton>
              </>
            ) : (
              <>
                {task.text}
                <div>
                  <button onClick={() => editTask(task.id, task.text)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </>
            )}
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
};

export default TodoApp;
