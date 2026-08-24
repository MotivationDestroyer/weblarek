type EventCallback = (data?: unknown) => void;

export class EventEmitter {
	private events: Map<string, Set<EventCallback>> = new Map();

	on(event: string, callback: EventCallback): void {
		if (!this.events.has(event)) {
			this.events.set(event, new Set());
		}

		this.events.get(event)!.add(callback);
	}

	off(event: string, callback: EventCallback): void {
		this.events.get(event)?.delete(callback);
	}

	emit(event: string, data?: unknown): void {
		this.events.get(event)?.forEach((callback) => {
			callback(data);
		});
	}

	onAll(callback: EventCallback): void {
		this.events.set('*', new Set([callback]));
	}

	offAll(): void {
		this.events.clear();
	}

	trigger(
		event: string,
		context?: object
	): (data?: unknown) => void {
		return (data?: unknown) => {
			this.emit(event, {
				...context,
				data,
			});
		};
	}
}