import { IProduct } from "../../types";

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(id: string): void {
        this.preview = this.getItem(id) ?? null;
    }

    getPreview(): IProduct | null {
    return this.preview;
    }
}