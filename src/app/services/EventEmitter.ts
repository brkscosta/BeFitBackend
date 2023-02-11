interface EventEmitterInterface {
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
}

class EventEmitter implements EventEmitterInterface {
    private listeners: { [event: string]: Array<(...args: any[]) => void> } = {};

    on(event: string, listener: (...args: any[]) => void): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);

        return this;
    }

    off(event: string, listener: (...args: any[]) => void): this {
        if (!this.listeners[event]) {
            return this;
        }

        this.listeners[event] = this.listeners[event].filter(
            (registeredListener) => registeredListener !== listener
        );

        return this;
    }

    emit(event: string, ...args: any[]): boolean {
        if (!this.listeners[event]) {
            return false;
        }

        this.listeners[event].forEach((listener) => listener(...args));

        return true;
    }
}

export default EventEmitter;
