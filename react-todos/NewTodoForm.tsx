import { FormEvent, useState } from "react";

interface Props {
    onSubmit: (title: string) => void;
}

interface BadInput {
    isBadInput: boolean;
    message: string;
}

export default function NewTodoForm({ onSubmit }: Props) {
    const [newItem, setNewItem] = useState("");
    const [badInput, setBadInput] = useState<BadInput>({
        isBadInput: false,
        message: "",
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNewItem("");

        const input = validateInput(newItem);
        if (input == undefined) return;

        onSubmit(input);
    }

    function validateInput(item: string) {
        const trimmedItem = item.trim();
        // klasika regex nechutnej ale holt to tak musi byt
        const inputValidationRegex =
            /^[a-zA-Z]+[a-zA-Z0-9!@#$%^&*()_+-={};"',<>?. ]*$/;

        // strasnej if statement a dvojitej ternary operator ale nic lepsiho me nenapadlo
        if (trimmedItem === "" || !inputValidationRegex.test(trimmedItem) || trimmedItem.length < 3) {
            const message = !trimmedItem
                ? "You can't put in an empty string"
                : trimmedItem.length < 3
                    ? "Todo has to be atleast 3 characters long"
                    : "You can't put only special characters or numbers";

            setBadInput({ isBadInput: true, message });
            setTimeout(() => {
                setBadInput({ isBadInput: true, message: "" });
            }, 2000);

            return;
        }

        return trimmedItem;
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="item">New Item</label>
            <input
                type="text"
                id="item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
            />
            <button>Add</button>
            {badInput.isBadInput && badInput.message}
        </form>
    );
}
