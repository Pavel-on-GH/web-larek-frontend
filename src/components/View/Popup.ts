import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPopupData {
	content: HTMLElement;
}

export class Popup extends Component<IPopupData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	set content(value: HTMLElement | null) {
		if (value === null) {
			this._content.innerHTML = '';
		} else {
			this._content.replaceChildren(value);
		}
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		document.addEventListener('keyup', this.handleEscUp);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		document.removeEventListener('keyup', this.handleEscUp);
		this.content = null;
		this.events.emit('modal:close');
	}

	handleEscUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.close();
		}
	}

	render(data: IPopupData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
