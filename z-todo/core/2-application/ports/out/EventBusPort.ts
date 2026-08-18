import { DomainEvent } from '../../../1-domain/events/DomainEvent';

export interface EventBusPort {
  publish(events: readonly DomainEvent[]): void;
  subscribe(eventName: string, handler: (event: DomainEvent) => void): void;
}