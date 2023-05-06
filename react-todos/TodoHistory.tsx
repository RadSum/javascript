import { Todo } from "../App";

interface Props {
    todoHistory: Todo[];
    restoreTodo: (title: Todo) => void;
    clearHistory: () => void;
}

export default function TodoHistory({ todoHistory, restoreTodo, clearHistory }: Props) {
    return (
        <>
            <h1>Deleted Todos</h1>
            <ul>
                {todoHistory.map((todo) => (
                    <span key={todo.id}>
                        <li style={{ fontSize: "20px" }}>{todo.title}</li>
                        <button onClick={() => restoreTodo(todo)}>Restore Todo</button>
                    </span>
                ))
                }
            </ul>
            {todoHistory.length > 0 && <button onClick={clearHistory}>Clear History</button>}
        </>
    );
}
