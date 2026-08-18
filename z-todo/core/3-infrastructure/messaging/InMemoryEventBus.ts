import { EventBusPort } from '../../2-application/ports/out/EventBusPort';
import { DomainEvent } from '../../1-domain/events/DomainEvent';

export class InMemoryEventBus implements EventBusPort {
    private handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map();

    publish(events: DomainEvent[]): void {
        events.forEach(event => {
            const eventHandlers = this.handlers.get(event.eventName) || [];
            eventHandlers.forEach(handler => handler(event));
        });
    }

    subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
        const existing = this.handlers.get(eventName) || [];
        existing.push(handler);
        this.handlers.set(eventName, existing);
    }
}