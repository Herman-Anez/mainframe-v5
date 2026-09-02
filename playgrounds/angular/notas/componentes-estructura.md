```ts
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from "@angular/core";

@Component({
    // Etiqueta HTML para usar el componente
    selector: "app-mi-componente",
    standalone: true,// Componente independiente (Angular 15+)
    imports: [],// Otros componentes, directivas o pipes
    templateUrl: "./mi-componente.component.html",
    styleUrls: ["./mi-componente.component.css"],
    // Opcionales:
    // changeDetection: ChangeDetectionStrategy.OnPush,
    // encapsulation: ViewEncapsulation.None,
    // providers: [MiServicio],
})
export class MiComponente implements OnInit, OnChanges, OnDestroy {
    // 🟡 Entradas (@Input): reciben datos desde el componente padre
    @Input() titulo: string = "";
    @Input() datos: any[] = [];

    // 🔵 Salidas (@Output): emiten eventos al componente padre
    @Output() seleccionado = new EventEmitter<any>();

    // 🔒 Propiedades internas
    contador = 0;

    // Constructor: se usa para inyección de dependencias
    constructor() {}

    // Se ejecuta cuando cambian los @Input
    ngOnChanges(changes: SimpleChanges): void {
        console.log("Cambios en inputs:", changes);
    }

    // Se ejecuta una sola vez al inicializar el componente
    ngOnInit(): void {
        console.log("Componente inicializado");
    }

    // Métodos personalizados
    incrementar(): void {
        this.contador++;
        this.seleccionado.emit(this.contador); // Emite el evento al padre
    }

    // Se ejecuta justo antes de destruir el componente
    ngOnDestroy(): void {
        console.log("Componente destruido");
        // Aquí se cancelan suscripciones, timers, etc.
    }
}
```
