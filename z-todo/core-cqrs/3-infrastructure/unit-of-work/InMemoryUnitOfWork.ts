import { UnitOfWorkPort } from '../../2-application/ports/out/UnitOfWorkPort';

export class InMemoryUnitOfWork implements UnitOfWorkPort {
    async begin(): Promise<void> {
        // No-op en memoria; en una BD real iniciaría una transacción.
    }

    async commit(): Promise<void> {
        // No-op
    }

    async rollback(): Promise<void> {
        // No-op
    }
}
