/**
 * Forma "de fila" de una TodoList: datos planos, sin comportamiento ni reglas.
 * Es lo que efectivamente se guarda (en el Map in-memory hoy; en una tabla,
 * documento o JSON con otra implementación). Solo strings — serializable tal cual.
 *
 * Vive en 4-infrastructure porque es un detalle de persistencia: ni el dominio
 * ni la aplicación lo conocen.
 */
export interface TodoItemRecord {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export interface TodoListRecord {
  id: string;
  name: string;
  items: TodoItemRecord[];
}
