"use client";
import { useState } from "react";
import styles from "./page.module.css";

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

const examples = [{ name: "pre y code", component: Example }];

function ExampleSelector() {
    const [selected, setSelected] = useState(0);
    const Selected = examples[selected].component;
    return (
        <div className={styles.selector}>
            <select
                className={styles.select}
                value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
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

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <ExampleSelector />
            </main>
        </div>
    );
}
