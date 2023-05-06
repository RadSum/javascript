interface Props {
    deleteMarkedTodos: () => void;
    checkAllTodos: () => void;
    allChecked: boolean;
    toggleShowHistory: () => void;
}

export default function TodoButtons({
    deleteMarkedTodos,
    checkAllTodos,
    allChecked,
    toggleShowHistory
}: Props) {
    return (
        <>
            <button onClick={deleteMarkedTodos}>
                Delete checked todos
            </button>
            <button onClick={checkAllTodos}>
                Mark all todos as {allChecked ? "unchecked" : "checked"}
            </button>
            <button onClick={toggleShowHistory}>
                Show todo history
            </button >
        </>
    );
}
