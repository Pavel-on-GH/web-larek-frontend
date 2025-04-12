import './scss/styles.scss';

import { IEvents, EventEmitter } from './components/base/events';
import { IProductList, IOrder, PaymentType } from './types/index';
import { ensureElement, cloneTemplate } from './utils/utils';

import { ModelProducts } from './components/Model/ModelProducts';
import { ModelBasket } from './components/Model/ModelBasket';
import { ModelOrder } from './components/Model/ModelOrder';
import { Popup } from './components/View/Popup';
import { Card, BasketCard } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { Contacts } from './components/View/Contacts';
import { Payment } from './components/View/Payment';
import { Page } from './components/View/Page';

const events: IEvents = new EventEmitter();

const productsData = new ModelProducts(events);
const basketData = new ModelBasket(events);
const orderData = new ModelOrder(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
const body = document.body;

const page = new Page(document.body, events);
const modal = new Popup(modalContainerTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactForm = new Contacts(cloneTemplate(contactsTemplate), events);
const orderForm = new Payment(cloneTemplate(orderTemplate), events);

events.on('card:change', () => {
	page.counter = basketData.products.length;
	page.catalog = productsData.products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:selected', product);
			},
		});
		return card.render({
			id: product.id,
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

events.on('preview:change', (product: IProductList) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', product);
			events.emit('preview:change', product);
			modal.close();
		},
	});

	modal.render({
		content: card.render({
			id: product.id,
			category: product.category,
			description: product.description,
			image: product.image,
			price: product.price,
			title: product.title,
			buttonText: basketData.getButtonStatus(product),
		}),
	});
});

events.on('card:basket', (product: IProductList) => {
	basketData.isBasketCard(product);
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:change', () => {
	page.counter = basketData.products.length;
	basket.price = basketData.getBasketPrice();
	basket.items = basketData.products.map((basketCard, index) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketData.removeFromBasket(basketCard);
			},
		});
		newBasketCard.index = index + 1;
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		orderData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order:change',
	(data: { payment: PaymentType; button: HTMLElement }) => {
		orderForm.togglePayment(data.button);
		orderData.setPayment(data.payment);
		orderData.validateOrder();
	}
);

events.on('errors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;

	orderForm.valid = !(payment || address);
	orderForm.errors = [payment, address].filter(Boolean).join('; ');

	contactForm.valid = !(email || phone);
	contactForm.errors = [email, phone].filter(Boolean).join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});
