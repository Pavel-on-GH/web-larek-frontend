import { IOrder, IProductList } from '../../types/index';
import { IApi } from '../../types';
import { ApiListResponse } from '../base/api';

export class AppApi {
	private _baseApi: IApi;
	private url: string;

	constructor(url: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.url = url;
	}

	async getProducts(): Promise<IProductList[]> {
		const response = await this._baseApi.get<ApiListResponse<IProductList>>(
			`/product`
		);
		return response.items.map((product) => ({
			...product,
			image: this.url + product.image,
		}));
	}

	async getProduct(id: string): Promise<IProductList> {
		const product = await this._baseApi.get<IProductList>(`/product/${id}`);
		return {
			...product,
			image: this.url + product.image,
		};
	}

	async orderProducts(order: IOrder): Promise<IOrder> {
		const data = await this._baseApi.post<IOrder>('/order', order);
		return data;
	}
}
