import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
	private items: IProduct[] = [];

	constructor(private events: EventEmitter) {}

	addItem(item: IProduct): void {
		if (!this.hasItem(item.id)) {
			this.items.push(item);

			this.events.emit(
				'basket:changed',
				this.items
			);
		}
	}

	removeItem(id: string): void {
		this.items = this.items.filter(
			(item) => item.id !== id
		);

		this.events.emit(
			'basket:changed',
			this.items
		);
	}

	getItems(): IProduct[] {
		return this.items;
	}

	clear(): void {
		this.items = [];

		this.events.emit(
			'basket:changed',
			this.items
		);
	}

	getTotal(): number {
		return this.items.reduce(
			(sum, item) =>
				sum + (item.price ?? 0),
			0
		);
	}

	getCount(): number {
		return this.items.length;
	}

	hasItem(id: string): boolean {
		return this.items.some(
			(item) => item.id === id
		);
	}
}