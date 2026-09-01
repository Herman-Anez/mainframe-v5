import { ApiContract, buildPath } from './apiContract';

/**
 * Ejemplo básico: cómo un cliente consumiría los 9 endpoints usando
 * `ApiContract` (método + path, de `apiContract.ts`, acá mismo) para no
 * hardcodear URLs a mano.
 *
 * No hay ningún backend real corriendo en `baseUrl` — cada `fetch` va a
 * fallar (conexión rechazada), y eso es lo esperado: esto es la forma del
 * consumo, no una demo que necesite un servidor de verdad. El día que exista
 * un binder real (Express/Fastify/Next.js) sirviendo estas mismas rutas,
 * este mismo código funciona sin cambiar una línea.
 *
 * Correr con: pnpm exec tsx core/3-adapters/http/httpExample.ts
 */

const baseUrl = 'http://localhost:3000';

async function callEndpoint(
    label: string,
    endpoint: { method: string; path: string },
    params: Record<string, string> = {},
    body?: unknown,
): Promise<void> {
    try {
        const url = baseUrl + buildPath(endpoint.path, params);
        const hasBody = endpoint.method !== 'GET' && endpoint.method !== 'DELETE';

        const response = await fetch(url, {
            method: endpoint.method,
            headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
            body: hasBody ? JSON.stringify(body) : undefined,
        });

        console.log(`${label} →`, await response.json());
    } catch (error) {
        console.log(`${label} → (esperado, no hay backend corriendo) ${(error as Error).message}`);
    }
}

async function main(): Promise<void> {
    // POST /lists — crear una lista
    await callEndpoint('POST /lists', ApiContract.createTodoList, {}, { name: 'Compras del súper' });

    // GET /lists — listar todas
    await callEndpoint('GET /lists', ApiContract.listTodoLists);

    // GET /lists/:listId — consultar una lista
    await callEndpoint('GET /lists/:listId', ApiContract.getTodoList, { listId: 'list-id-de-ejemplo' });

    // POST /lists/:listId/items — agregar un item
    await callEndpoint(
        'POST /lists/:listId/items',
        ApiContract.addTodoItem,
        { listId: 'list-id-de-ejemplo' },
        { title: 'Comprar leche', description: '2 litros', priority: 'HIGH' },
    );

    // POST /lists/:listId/items/:itemId/complete — completar un item
    await callEndpoint('POST .../complete', ApiContract.completeTodoItem, {
        listId: 'list-id-de-ejemplo',
        itemId: 'item-id-de-ejemplo',
    });

    // PATCH /lists/:listId/items/:itemId/title — renombrar un item
    await callEndpoint(
        'PATCH .../title',
        ApiContract.renameTodoItem,
        { listId: 'list-id-de-ejemplo', itemId: 'item-id-de-ejemplo' },
        { newTitle: 'Comprar pan integral' },
    );

    // PATCH /lists/:listId/items/:itemId/description — cambiar descripción
    await callEndpoint(
        'PATCH .../description',
        ApiContract.changeTodoItemDescription,
        { listId: 'list-id-de-ejemplo', itemId: 'item-id-de-ejemplo' },
        { newDescription: '1 bolsa' },
    );

    // PATCH /lists/:listId/items/:itemId/priority — cambiar prioridad
    await callEndpoint(
        'PATCH .../priority',
        ApiContract.changeTodoItemPriority,
        { listId: 'list-id-de-ejemplo', itemId: 'item-id-de-ejemplo' },
        { newPriority: 'LOW' },
    );

    // DELETE /lists/:listId — borrar una lista
    await callEndpoint('DELETE /lists/:listId', ApiContract.deleteTodoList, { listId: 'list-id-de-ejemplo' });
}

main();
