/**
 * Browser shim for Node's built-in `crypto` module (only `randomUUID` is used
 * by 1-domain's TodoListId/TodoItemId). The Web Crypto API exposes the same
 * function on `globalThis.crypto`, available in all evergreen browsers.
 * Mapped via tsconfig `paths` so 1-domain stays untouched.
 */
export const randomUUID = (): string => globalThis.crypto.randomUUID();
