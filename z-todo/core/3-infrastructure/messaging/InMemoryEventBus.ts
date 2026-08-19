import { EventBusPort } from '../../2-application/ports/out/EventBusPort';
import { DomainEvent } from '../../1-domain/events/DomainEvent';

export class InMemoryEventBus implements EventBusPort {
    private handlers: Map<string, Array<(event: DomainEvent) => void | Promise<void>>> = new Map();

    async publish(events: readonly DomainEvent[]): Promise<void> {
        for (const event of events) {
            const eventHandlers = this.handlers.get(event.eventName) || [];
            for (const handler of eventHandlers) {
                await handler(event);
            }
        }
    }

    subscribe(eventName: string, handler: (event: DomainEvent) => void | Promise<void>): void {
        const existing = this.handlers.get(eventName) || [];
        existing.push(handler);
        this.handlers.set(eventName, existing);
    }
}