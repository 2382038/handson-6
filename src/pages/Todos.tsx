import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodoList {
  todos: Todo[];
}

const fetchTodos = async () => {
  return await axios.get<TodoList>("/todos");
};

const TodoSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="w-full h-20 bg-gray-300 rounded-lg"></div>
      <div className="w-2/3 h-6 bg-gray-300 rounded"></div>
    </div>
  );
};

const Todos = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Todos"],
    queryFn: fetchTodos,
  });
  const navigate = useNavigate();

  const handleTodoClick = (todoId: number) => {
    navigate(`/todos/${todoId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Loading todos...</h2>
          <TodoSkeleton />
          <TodoSkeleton />
          <TodoSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-6">Error fetching todos:</h2>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Todo List</h1>
        <div className="space-y-6">
          {data?.data.todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-4 rounded-lg shadow-lg transition-all"
              onClick={() => handleTodoClick(todo.id)}
            >
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{todo.todo}</h2>
                <p className={`mt-2 ${todo.completed ? "text-green-600" : "text-red-600"}`}>
                  {todo.completed ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => navigate("./add")}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </div>
  );
};

export default Todos;