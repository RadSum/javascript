import { useState, useEffect } from "react";
import NewTodoForm from "./Components/NewTodoForm.tsx";
import TodoList from "./Components/TodoList.tsx";
import TodoHistory from "./Components/TodoHistory.tsx";
import TodoButtons from "./Components/TodoButtons.tsx";
import "./App.css";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(retrieveItem("ITEMS"));
  const [todoHistory, setTodoHistory] = useState<Todo[]>(retrieveItem("TODO_HISTORY"));
  const [allChecked, setAllChecked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("TODO_HISTORY", JSON.stringify(todoHistory));
  }, [todoHistory])

  function retrieveItem(itemName: string) {
    const localValue = localStorage.getItem(itemName);
    if (localValue == null || localValue === "undefined") return [];

    return JSON.parse(localValue);
  }

  function getRandomId() {
    return Math.random().toString(36).slice(2, 7);
  }

  function addTodo(title: string) {
    setTodos([...todos, { id: getRandomId(), title, completed: false }]);
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id: string) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id);
    });

    setTodoHistory(currentHistory => {
      return [...currentHistory, todos.find(todo => todo.id === id) as Todo];
    });
  }

  function deleteMarkedTodos() {
    setAllChecked(false);
    setTodos(currentTodos => {
      return currentTodos.filter(todo => !todo.completed);
    });

    setTodoHistory(currentHistory => {
      const deletedTodos = todos.filter(todo => todo.completed);

      return [...currentHistory, ...deletedTodos];
    })
  }

  function checkAllTodos() {
    if (todos.length === 0) return;

    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        return { ...todo, completed: !allChecked };
      });
    });
    setAllChecked(!allChecked);
  }

  function restoreTodo(todo: Todo) {
    setTodos(todos => {
      return [...todos, { ...todo, completed: false }];
    });

    setTodoHistory(currentHistory => {
      return [...currentHistory.filter(curr => curr.id !== todo.id)];
    })
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory)
  }

  function clearTodoHistory() {
    setTodoHistory([]);

    localStorage.removeItem("TODO_HISTORY");
  }

  return (
    <>
      <NewTodoForm onSubmit={addTodo} />
      <h1>Todo List</h1>
      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />
      <br />
      <TodoButtons
        toggleShowHistory={toggleShowHistory}
        deleteMarkedTodos={deleteMarkedTodos}
        allChecked={allChecked}
        checkAllTodos={checkAllTodos}
      />
      {showHistory &&
        <TodoHistory
          todoHistory={todoHistory}
          restoreTodo={restoreTodo}
          clearHistory={clearTodoHistory}
        />}
    </>
  );
}

export default App;
