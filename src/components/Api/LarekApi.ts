import {
	IApi,
	IOrder,
	IOrderResult,
	IProductsData,
} from '../../types';

export class LarekApi {
	constructor(private api: IApi) {}

	getProducts(): Promise<IProductsData> {
		return this.api.get<IProductsData>(
			'/product'
		);
	}

	orderProducts(
		order: IOrder
	): Promise<IOrderResult> {
		return this.api.post<IOrderResult>(
			'/order',
			order
		);
	}
}