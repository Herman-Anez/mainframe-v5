export interface UnitOfWorkPort {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}