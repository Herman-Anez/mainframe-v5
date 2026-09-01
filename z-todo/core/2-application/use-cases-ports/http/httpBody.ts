/** Helpers compartidos para leer el body crudo de un request en los `buildInput` de cada ruta. */

export function bodyAsRecord(body: unknown): Record<string, unknown> {
  return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
}

export function stringField(record: Record<string, unknown>, key: string, fallback = ''): string {
  const value = record[key];
  return typeof value === 'string' ? value : fallback;
}
