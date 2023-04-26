import { useState } from "react";

interface Props {
    text: string;
    handleRemove: (todoText: string) => void;
}

function Todo({ text, handleRemove }: Props) {
    const [done, setDone] = useState(false);

    function handleClick() {
        setDone(!done);
    }

    return (
        <span>
            <h1 onClick={handleClick} style={{textDecoration: done ? "line-through" : "none"}}>{text}</h1>
            {done && <button onClick={() => handleRemove(text)}>Remove This Todo</button>}
        </span>
    );
}

export default Todo;