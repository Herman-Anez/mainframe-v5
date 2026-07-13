"use client";
import React from "react";

// Props que el componente envuelto puede esperar
// (lo dejamos genérico para que sirva para cualquier componente)
interface BaseProps {
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any; // Para aceptar cualquier otra prop
}

// Clase genérica que recibe el componente por atributo (constructor)
class ComponentFactory<P extends BaseProps = BaseProps> {
    private WrappedComponent: React.ComponentType<P>;
    private defaultClassName: string;
    private defaultStyle: React.CSSProperties;

    // El componente "entra por atributo" aquí en el constructor
    constructor(
        Component: React.ComponentType<P>,
        defaultClassName: string = "",
        defaultStyle: React.CSSProperties = {},
    ) {
        this.WrappedComponent = Component;
        this.defaultClassName = defaultClassName;
        this.defaultStyle = defaultStyle;
    }

    // Método que retorna un componente funcional basado en el componente recibido
    createComponent(): React.FC<P> {
        const ComponentToRender = this.WrappedComponent;
        const baseClassName = this.defaultClassName;
        const baseStyle = this.defaultStyle;

        // Este es el componente funcional que se retorna
        const FunctionalComponent: React.FC<P> = (props) => {
            // Combinamos las props externas con las internas (style y className)
            const mergedProps = {
                ...props,
                className: `${baseClassName} ${props.className || ""}`.trim(),
                style: { ...baseStyle, ...props.style },
            } as P;

            return <ComponentToRender {...mergedProps} />;
        };

        // Asignamos un nombre para mejor depuración en React DevTools
        FunctionalComponent.displayName = `ComponentFactory(${ComponentToRender.displayName || ComponentToRender.name || "Component"})`;

        return FunctionalComponent;
    }
}

export default ComponentFactory;
