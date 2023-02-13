interface EventEmitterInterface {
    on(event: string, listener: (...args: unknown[]) => void): this;
    off(event: string, listener: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): boolean;
}

class EventEmitter implements EventEmitterInterface {
    private listeners: { [event: string]: Array<(...args: unknown[]) => void> } = {};

    on(event: string, listener: (...args: unknown[]) => void): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);

        return this;
    }

    off(event: string, listener: (...args: unknown[]) => void): this {
        if (!this.listeners[event]) {
            return this;
        }

        this.listeners[event] = this.listeners[event].filter(
            (registeredListener) => registeredListener !== listener
        );

        return this;
    }

    emit(event: string, ...args: unknown[]): boolean {
        if (!this.listeners[event]) {
            return false;
        }

        this.listeners[event].forEach((listener) => listener(...args));

        return true;
    }
}

export default EventEmitter;
