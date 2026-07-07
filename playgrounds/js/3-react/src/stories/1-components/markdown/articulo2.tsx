import React from "react";

// Definimos el tipo de las props que aceptará el componente generado
interface ComponentProps {
    message?: string;
    className?: string;
}

// Clase que construye componentes funcionales
class ComponentFactory {
    private displayName: string;
    private style: React.CSSProperties;

    constructor(displayName: string, style: React.CSSProperties = {}) {
        this.displayName = displayName;
        this.style = style;
    }

    // Método que retorna un componente funcional
    createComponent(): React.FC<ComponentProps> {
        // Definimos el componente funcional usando un closure para acceder a las propiedades de la instancia
        const FunctionalComponent: React.FC<ComponentProps> = ({
            message,
            className,
        }) => {
            const defaultMessage = `Hola desde ${this.displayName}`;
            return (
                <div style={this.style} className={className}>
                    {message || defaultMessage}
                </div>
            );
        };

        // Asignamos un nombre al componente para mejor depuración
        FunctionalComponent.displayName = this.displayName;

        return FunctionalComponent;
    }
}

export default ComponentFactory;

// Ejemplo de uso:
// const factory = new ComponentFactory('MiComponente', { color: 'blue', fontWeight: 'bold' });
// const MiComponente = factory.createComponent();
// Luego se usa <MiComponente message="Mensaje personalizado" className="clase-css" />
