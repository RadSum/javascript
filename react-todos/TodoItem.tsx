interface Props {
    id: string;
    title: string;
    completed: boolean;
    toggleTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

export default function TodoItem({
    id,
    title,
    completed,
    toggleTodo,
    deleteTodo,
}: Props) {
    return (
        <li>
            <label style={{ margin: "10px" }}>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={e => toggleTodo(id, e.target.checked)}
                />
                <span style={{ fontSize: "30px" }}>{title}</span>
            </label>
            <button onClick={() => deleteTodo(id)}>Delete</button>
        </li>
    );
}
