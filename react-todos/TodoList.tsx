import { Todo } from "../App.tsx";
import TodoItem from "./TodoItem.tsx";

interface Props {
    todos: Todo[];
    toggleTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo }: Props) {
    return (
        <ul style={{ listStyle: "none" }}>
            {todos.length === 0 && "No todos"}
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    {...todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
            ))}
        </ul>
    );
}
