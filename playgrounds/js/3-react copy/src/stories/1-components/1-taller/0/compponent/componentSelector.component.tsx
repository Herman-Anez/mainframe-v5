import type { ComponentType } from "react";
import styles from "./componentSelector.module.css";

function Example() {
    const code = `function Example() {
    return (
        <pre>
            <code>{code}</code>
        </pre>
    );
}
`;
    return (
        <pre>
            <code>{code}</code>
        </pre>
    );
}
function Example2() {
    return (
        <pre>
            <code>{"code"}</code>
        </pre>
    );
}
export interface ComponentExample {
    name: string;
    component: ComponentType;
}
const defaultExamples: ComponentExample[] = [
    { name: "pre y code", component: Example },
    { name: "pre y code 2", component: Example2 },
];
export interface ComponentSelectorProps {
    examples?: ComponentExample[];
    selected?: number;
    onSelect?: (index: number) => void;
}
export default function ComponentSelector({
    examples = defaultExamples,
    selected = 0,
    onSelect = () => {},
}: ComponentSelectorProps) {
    const Selected = examples[selected].component;
    return (
        <div className={styles.selector}>
            <select
                className={styles.select}
                value={selected}
                onChange={(e) => onSelect(Number(e.target.value))}
            >
                {examples.map((example, i) => (
                    <option key={example.name} value={i}>
                        {example.name}
                    </option>
                ))}
            </select>
            <Selected />
        </div>
    );
}



