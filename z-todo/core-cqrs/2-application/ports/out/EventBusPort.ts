import { DomainEvent } from '../../../1-domain/events/DomainEvent';

export interface EventBusPort {
  publish(events: readonly DomainEvent[]): Promise<void>;
  subscribe(eventName: string, handler: (event: DomainEvent) => void | Promise<void>): void;
}