import './App.css';
import Todo from './components/Todo.tsx';
import { useState, useRef, MutableRefObject } from "react";

function App() {
  const [todos, setTodos] = useState([] as string[]);
  const input = useRef() as MutableRefObject<HTMLInputElement>;

  function onAdd(text: string) {
    const newTodos = [...todos, text];
    setTodos(newTodos);
  }

  function removeTodo(todoText: string) {
    const todoIdx = todos.indexOf(todoText);
    todos.splice(todoIdx, 1);

    setTodos([...todos]);
  }

  function handleClick() {
    const todo = input.current.value;

    if (todo.trim() !== "") {
      onAdd(todo);
      input.current.value = "";
    }
  }

  return (
    <>
      {todos.map(todo => <Todo key={todo} text={todo} handleRemove={removeTodo}/>)}
      <br/>
      <input type="text" ref={input}></input>
      <button onClick={handleClick}>Add Todo</button>
    </>
  )
}

export default App;
