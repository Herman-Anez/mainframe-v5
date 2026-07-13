import { useState, type ComponentType } from "react";
import type { ComponentSelectorProps } from "./componentSelector.component";




export default  function withSelectorState<P extends ComponentSelectorProps>(
    Component: ComponentType<P>,
) {
    return function WithSelectorState(
        props: Omit<P, keyof ComponentSelectorProps>,
    ) {
        const [selected, setSelected] = useState(0);
        return (
            <Component
                {...(props as P)}
                selected={selected}
                onSelect={setSelected}
            />
        );
    };
}

