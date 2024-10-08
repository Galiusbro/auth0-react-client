import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const TodoList = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTodos = async () => {
        try {
          // Получение токена доступа
          const token = await getAccessTokenSilently();

          // Настройка опций для запроса
          const options = {
            method: "GET",
            url: "http://localhost:3033/api/todos",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          // Запрос данных о задачах
          const response = await axios(options);
          setTodos(response.data.todos); // Сохраняем массив задач

          // Запрос для генерации ключей, если они отсутствуют
          const keysResponse = await axios.post(
            "http://127.0.0.1:5000/generate_keys_if_absent",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Сохранение данных ключей в состояние
          setKeys(keysResponse.data.keys);
        } catch (error) {
          console.error("Error fetching todos or generating keys:", error);
        }
      };

      fetchTodos();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const addTodo = async () => {
    try {
      const token = await getAccessTokenSilently();
      const options = {
        method: "POST",
        url: "http://localhost:3033/api/todos",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          title: newTodo,
        },
      };

      const response = await axios(options);
      setTodos(response.data.todos); // Обновляем задачи после добавления новой
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const options = {
        method: "DELETE",
        url: `http://localhost:3033/api/todos/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);
      setTodos(response.data.todos); // Обновляем список задач после удаления
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          To-Do List
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New To-Do"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTodo}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300"
          >
            Add
          </button>
        </div>

        <ul className="divide-y divide-gray-200 mb-6">
          {todos && todos.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo._id}
                className="py-2 flex items-center justify-between"
              >
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex space-x-2">
                  {todo.completed && (
                    <span className="text-green-500 font-bold">✓</span>
                  )}
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No tasks available</p>
          )}
        </ul>

        {keys && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Keys Information</h2>
            <p className="text-sm">
              <strong>User ID:</strong> {keys.user_id}
            </p>
            <p className="text-sm">
              <strong>Key ID:</strong> {keys._id}
            </p>
            <p className="text-sm">
              <strong>Certificate:</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto break-words whitespace-pre-wrap max-h-40">
              {keys.certificate}
            </pre>
            <p className="text-sm">
              <strong>Public Key (Base64):</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto break-words whitespace-pre-wrap max-h-40">
              {keys.public_key}
            </pre>
            <p className="text-sm">
              <strong>Pprivate Key (Base64):</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto break-words whitespace-pre-wrap max-h-40">
              {keys.private_key}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
