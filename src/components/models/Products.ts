import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Products {
	private items: IProduct[] = [];
	private preview: IProduct | null = null;

	constructor(private events: EventEmitter) {}

	setItems(items: IProduct[]): void {
		this.items = items;

		this.events.emit(
			'products:changed',
			this.getItems()
		);
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getItem(id: string): IProduct | undefined {
		return this.items.find(
			(item) => item.id === id
		);
	}

	setPreview(id: string): void {
		this.preview =
			this.getItem(id) ?? null;

		this.events.emit(
			'preview:changed',
			this.getPreview() ?? undefined
		);
	}

	getPreview(): IProduct | null {
		return this.preview;
	}
}