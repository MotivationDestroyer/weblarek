import { IOrder } from "../../types";

export class Order {
    private order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };

    setOrder(data: Partial<IOrder>): void {
        this.order = {
            ...this.order,
            ...data,
        };
    }

    getOrder(): IOrder {
        return this.order;
    }

    clear(): void {
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0,
        };
    }

    validate(): boolean {
        return (
            this.order.payment.trim() !== '' &&
            this.order.address.trim() !== '' &&
            this.order.email.trim() !== '' &&
            this.order.phone.trim() !== ''
        );
    }
}