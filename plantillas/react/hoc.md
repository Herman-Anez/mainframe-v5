compoenente

```tsx
export type ComponentProps = {
    flag1: boolean;
    text: string;
};

export default function Component({ text }: ComponentProps) {
    return (
        <>
            <p>{text}</p>
        </>
    );
}
```


## Se lee una propiedad y ....

### La utiliza 

```tsx
export default function withExtraText<P extends ComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithLoading(props: P) {
        const { flag1 } = props;
        return (
            <>
                {flag1 && <p>flag1</p>}
                <WrappedComponent {...props} />
            </>
        );
    }
}

```
### La intercepta 

```tsx

import type { ComponentType } from "react";

export default function withExampleText<P extends ComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithExampleText(props: Omit<P, 'flag1' | 'text'>) {
        const { pending, trigger } = useFakePending(1000);
        return <WrappedComponent {...(props as P)} flag1={flag1} text={text} />;
    }
}


```



```tsx
import type { ComponentType } from "react";
import type { ComponentProps } from "../../submitButton.component";

// HOC: inyecta `styles.button` leyendo el css module, WrappedComponent no conoce el origen
export default function withModuleStyle<P extends ComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithModuleStyle(props: Omit<P, 'styles'>) {
        return <WrappedComponent {...(props as P)} styles={cssModule} />;
    }
}
```


Wrap a component with additional functionality/props.

### 

```tsx
import type { ComponentType } from "react";
import type { ComponentProps } from "../../submitButton.component";



export default function withNewProp<K extends string, V>(name: K, value: V) {
    return function <P extends ComponentProps>(WrappedComponent: ComponentType<P & Record<K, V>>) {
        return function WithNewProp(props: Omit<P & Record<K, V>, K>) {
            return <WrappedComponent {...(props as P & Record<K, V>)} {...({ [name]: value } as Record<K, V>)} />;
        };
    };
}


export default function withLoading<P extends ComponentProps>(
    WrappedComponent: ComponentType<P>
) {
    return function WithLoading(props: P) {
        const { pending } = props;
        return (
            <>
                {pending && <p>pending</p>}
                <WrappedComponent {...props} />
            </>
        );
    }
}

```
