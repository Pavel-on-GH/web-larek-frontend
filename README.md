# Проектная работа "Веб-ларек"

## Описание проекта

"Веб-ларек" - это проект фронтенд-части интернет-магазина для web-разработчиков. Пользователи могут просматривать каталог доступных товаров, добавлять понравившиеся позиции в корзину и удалять их оттуда, а так же оформить доставку заказа.
В качестве основы приложения выступает архитектура MVP, проект выполнен на TypeScript и подключён к внешнему API.

## Архитектура приложения

В качестве основного принципа архитектуры использован MVP (Model-View-Presenter), обеспечивающий разделение зон ответственности между слоями и классами, где каждый слой выполняет свою роль:

- Model - Работа с загрузкой данных по API, сохранение и работа с данными полученными от пользователя;
- View - Отображает интерфейс для взаимодействия с пользователем, отлавливает и сообщает о произошедших событиях;
- Presenter - Связывает модели данных с отображением интерфейсов при сработке какого нибудь события, управляя взаимодействием между ними.

---

## Базовый код

### Класс Api

Код, дающий основу для взаимодействия с сервером через API с помощью работы с HTTP-запросами и обработкой ответов.

_Конструктор принимает один обязательный и один опциональный аргумент_

- constructor(readonly baseUrl: string, protected options: RequestInit = {}) - базовый URL и опционально, глобальные опции для всех запросов.

_Методы:_

- handleResponse<T>(response: Response): Promise<T> - Логика обработки ответа сервера, вынесенная в отдельную функцию;
- GET<T>(uri: string) - Функция принимающая url в качестве аргумента, и отправляющая на него GET-запрос;
- POST<T>(uri: string, data: object, method: ApiPostMethods = 'POST') - Функция принимающая url , data - объект с данными, представляющий собой тело запроса и метод передачи данных(по умолчанию POST). параметра при вызове.

### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в presenter для обработки событий и в слоях приложения для генерации событий. Конструктор класса не принимает внешних аргументов.

_Методы:_

- on<T extends object>(event: EventName, callback: (data: T) => void): void - Подписка на событие;
- off(eventName: EventName, callback: Subscriber) - Отписка от события;
- emit<T extends object>(eventName: string, data?: T) - Инициализация события.

### Класс Component

Абстрактный класс, на основе которого строятся все остальные компоненты интерфейса. Он предоставляет общие методы для управления DOM-элементами, например, переключение классов, установка текстового содержимого компонента, управление видимостью и т.д.

_Конструктор принимает один аргумент_

- constructor(protected readonly container: HTMLElement) - HTML-элемент, который будет служить контейнером для компонентов.

_Методы:_

- toggleClass(element: HTMLElement, className: string, force?: boolean) - Переключить класс;
- setText(element: HTMLElement, value: unknown) - Установить текстовое содержимое;
- setDisabled(element: HTMLElement, state: boolean) - Сменить статус блокировки;
- setVisible(element: HTMLElement) - Показать компонент;
- setHidden(element: HTMLElement) - Скрыть компонент;
- setImage(element: HTMLImageElement, src: string, alt?: string) - Задать изображение;
- render(data?: Partial<T>): HTMLElement - Отрендерить корневой DOM-элемент.

---

## Слой Model:

Model отвечает за хранение данных и обработку бизнес-логики приложения, таких как данные продуктов, корзины и заказов.

### Класс ModelProducts

Класс отвечает за хранение данных товара и логику работы с ними.

_Конструктор принимает один аргумент_

- constructor(protected events: IEvents) - Объект, реализующий интерфейс событий, являющийся экземпляром класса EventEmitter.

_Свойства:_

- \_products: IProductList[] - Массив карточек продуктов
- \_preview: string | null - Id выбранного продукта
- events: IEvents - Экземпляр класса `EventEmitter` для инициации событий при изменении данных.

_Методы:_

- addProduct(product: IProductList): void - Метод добавляет товар в начало списка продуктов.

_Геттеры:_

- getProduct(id: string): IProductList - Возвращает одну карточку продуктов по его id;
- getProducts(): IProductList[] - Возвращает массив карточек продуктов;
- get products(): IProductList[] - Геттер products возвращает текущий список продуктов.

_Сеттеры:_

- setProducts(products: IProductList[]): void - Метод для заполнения массива карточек продуктов.

### Класс ModelBasket

Класс отвечает за хранение данных корзины и логику работы с ней.

_Конструктор принимает один аргумент_
constructor(protected events: IEvents) - Объект, реализующий интерфейс событий, являющийся экземпляром класса EventEmitter.

_Свойства:_

- \_basket: IProductList[] - Массив объектов продукции, добавленных в корзину.

_Методы:_

- appendToBasket(product: IProductList): void - Метод для добавления товара в корзину;
- removeFromBasket(product: IProductList): void - Метод для удаления товара из корзины;
- isBasketCard(product: TProductBasket): void - Метод проверяет находится ли товар в корзине;
- clearBasket(): void - Метод для очистки всей корзины.

_Геттеры:_

- getBasketPrice(): number - Метод вычисляет и возвращает общую стоимость продуктов в корзине;
- getBasketQuantity(): number - Метод возвращает количество продуктов в корзине;
- get products(): TProductBasket[] - Геттер возвращает текущий список продуктов в корзине.

### Класс ModelOrder

Класс отвечает за хранение и работу с данными заказа.

_Конструктор принимает один аргумент:_

- constructor(protected events: IEvents) - Объект, реализующий интерфейс событий, являющийся экземпляром класса EventEmitter.

_Свойства:_

- \_formErrors: FormErrors — Объект содержащий ошибки валидации форм;
- \_order: IOrder — Объект, представляющий данные текущего заказа. Содержит следующие поля:
  - email: string — Электронная почта клиента;
  - phone: string — Номер телефона клиента;
  - address: string — Адрес доставки;
  - payment: string — Способ оплаты.

_Методы:_

- validateOrder - Выполняет валидацию заказа. Проверяет наличие значений в обязательных полях (email, phone, address, payment). Если одно из полей не заполнено, добавляет сообщение об ошибке;

_Геттеры:_

- get formErrors(): TFormErrors - Геттер возвращает текущие ошибки формы заказа;
- get order(): IOrder - Геттер возвращает текущий объект заказа.

_Сеттеры:_

- setPayment(value: PaymentType): void - Устанавливает способ оплаты в заказе;
- setOrderAddress(value: string): void - Устанавливает адрес доставки в заказе;
- setOrderEmail(value: string): void - Устанавливает электронную почту в заказе;
- setOrderField(field: keyof TOrderInput, value: string): void - Обновляет любое поле заказа на основе его имени и значения, после чего инициирует валидацию.

---

## Слой View:

Слой View управляет отображением данных и обработкой событий пользовательского интерфейса, таких как клики на карточки продуктов и кнопки.

### Класс Popup

Класс Popup относится к слою представления (View) приложения. Класс наследуется от родительского класса Component. Показывает поп-ап пользователю/покупателю. Предоставляет методы open, close, render для управления отображением поп-апом. Устанавливает слушатели для закрытия поп-ап по Esc, на клик в оверлей и кнопку закрытия.

_Конструктор принимает два аргумента:_

- constructor(container: HTMLElement, protected events: IEvents) - корневой элемент поп-ап в DOM, переданный в качестве HTMLElement и объект, реализующий интерфейс событий.

_Свойства:_

- \_modalButtonClose: HTMLButtonElement - Кнопка для закрытия модального окна;
- \_modalContent - Контейнер для содержимого модального окна;
- events - Брокер событий.

### Класс Card

Класс Card отвечает за отображение карточки товара и корзины, задавая в карточке данные категории, заголовка, изображения, цены и описания, так же добавление и удаление товаров в корзине. Данный клавсс является родительским для всех видов карточек. В свою очередь, данный класс наследуется от родительского класса Component и используется для отображения карточек на странице сайта.

_Конструктор принимает один аргумент:_

- constructor(container: HTMLElement) - HTML-элемент, который будет служить контейнером для карточки.

### Класс Basket

Класс Basket отвечает за управление корзиной товаров на странице, в частности: отображение списка товаров, расчет общей стоимости и обработку пользовательских действий, таких как оформление заказа.

_Конструктор класса принимает два аргумента:_

- constructor(container: HTMLElement, protected events: IEvents) - HTML-элемент, который будет служить контейнером для корзины и объект, используемый для обработки событий.

_Методы:_

- updateButtonState(value: boolean) — Метод, который обновляет состояние кнопки оформления заказа в зависимости от общей стоимости товаров. Блокирует кнопку, если стоимость товаров равно нулю.

_Сеттеры:_

- set price(value: number) — Сеттер устанавливает общую стоимость товаров в корзине;
- set items(items: HTMLElement[]) — Сеттер для обновления списка товаров в корзине.

### Класс Form

Класс Form представляет компонент формы в веб-приложении. Наследуется от класса Component.

_Конструктор класса принимает два аргумента:_

- constructor(protected container: HTMLFormElement, protected events: IEvents) - HTML-элемент формы, который будет служить контейнером и объект, реализующий интерфейс IEvents, используемый для обработки событий.

_Методы:_

- onInputChange(field: keyof T, value: string) — Метод вызывается при изменении значения любого поля ввода в форме;
- render(state: Partial & IFormValidator) - Метод используется для обновления состояния формы.

_Сеттеры:_

- set valid(value: boolean) — Сеттер устанавливает состояние валидности формы. Он принимает значение типа boolean и устанавливает атрибут disabled на кнопке отправки формы в зависимости от значения. Если значение true, кнопка становится активной, если false - неактивной;
- set errors(value: string) — Сеттер устанавливает текст ошибок формы.

### Класс Payment

Класс Payment так же относится к слою представления (View) приложения. Отвечает за управление выбором способа оплаты и адресом доставки в форме заказа. Наследуется от класса Form и определяет тип данных формы оплаты.

_Конструктор принимает два аргумента:_

- constructor(container: HTMLFormElement, protected events: IEvents) - HTML-элемент формы оплаты, который будет служить контейнером для компонента и объект, реализующий интерфейс обработки событий.

_Свойства:_

- \_buttonOnline: HTMLButtonElement — Кнопка для выбора оплаты онлайн (картой);
- \_buttonCash: HTMLButtonElement — кнопка для выбора оплаты при получении;
- \_address: HTMLInputElement — поле для ввода адреса доставки.

_Методы:_

- resetPayment() — метод для сброса состояния кнопок оплаты, используется при переключении кнопок;
- togglePayment(value: HTMLElement) — Метод для переключения активного способа оплаты. Сбрасывает предыдущий выбор и активирует выбранную кнопку.

_Сеттеры:_

- set address(value: string) — Cеттер для поля адреса, который устанавливает адрес доставки.

### Класс Contacts

_Конструктор принимает два аргумента:_

- constructor(container: HTMLFormElement, events: IEvents)- HTML-элемент формы контактов, который будет служить контейнером для компонента и объект, реализующий интерфейс обработки событий.

_Свойства:_

- \_email: HTMLInputElement — Поле ввода для электронной почты;
- \_phone: HTMLInputElement — Поле ввода для номера телефона.

Класс Contacts твечает за управление контактной информацией в форме заказа. Наследуется от класса Form.

_Сеттеры:_

- set email(value: string) — сеттер для поля электронной почты;
- set number(value: string) — сеттер для поля электронной почты.

### Класс Page

Класс Page предназначен для управления визуальной частью страницы, в частности каталогом товаров, счетчиком корзины и блокировкой страницы.
Этот класс используется для управления элементами страницы, обрабатывает события и изменяет визуальное представление в зависимости от состояния страницы.

_Конструктор принимает два аргумента:_

- constructor(container: HTMLElement, protected events: IEvents) -HTML-элемент, содержащий страницу, с которой будет работать класс и объект, содержащий события, которые будут вызваны в процессе работы с страницей.

_Свойства:_

- \_counter: HTMLElement — Счетчик корзины;
- \_catalog: HTMLElement — Элементы каталога товаров;
- \_wrapper: HTMLElement — Элемент обертки страницы;
- \_basket: HTMLElement — Элемент кнопки корзины.

_Сеттеры:_

- set counter(value: number) - Устанавливает значение счетчика товаров в корзине;
- set catalog(items: HTMLElement[]) - Устанавливает массив элементов HTML, представляющих товары в каталоге;
- set locked(value: boolean) - Устанавливает или снимает блокировку страницы.

---

## Слой Presenter:

Основной функционал слоя presenter в приложении выполняет брокер событий EventEmitter. Брокер событий управляет взаимодействием между Model и Views, передавая между ними события и обеспечивая логику обновления данных, реагируя на действия пользователя. Все события, связанные с действиями пользователя, передаются через брокер.

### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Методы данного класса: on, off и emit описаны ранее в разделе "базовый код".

### Класс AppApi

Класс AppApi предоставляет методы для взаимодействия с API приложения, в частности для получения данных о продуктах и оформления заказов. Он инкапсулирует базовый API (\_baseApi) и добавляет логику для работы с изображениями.

_Конструктор принимает два аргумента:_

- constructor(url: string, baseApi: IApi) - URL для изображений и экземпляр базового API.

_Свойства:_

- \_baseApi: baseApi: IApi - Экземпляр базового API;
- url: url: string - URL для изображений продуктов.

_Методы:_

- orderProducts(order: IOrder): Promise<IOrder> - Метод отправляет заказ на сервис.

_Сеттеры:_

- getProducts(): Promise<IProductList[]> - Метод возвращает массив объектов продуктов и добавляет изображение к каждому продукту;
- getProduct(id: string): Promise<IProductList> - Метод возращает определенный продукт по его идентификатору.

---

## Интерфейсы данных и их типизация:

### Интерфейс модели данных продукта

- interface IModelProducts {
- products: IProductList[] - Массив товаров;
- setProducts(products: IProductList[]): void - Метод для заполнения массива карточек товаров;
- getProducts(): IProductList[] - Метод, возвращающий массив карточек товаров;
- getProduct(id: string): IProductList - Метод, который возвращает одну карточку товаров по id;
  }

### Интерфейс модели данных корзины

- interface IModelBasket {
- products: TProductBasket[] - Массив объектов продуктов, которые добавлены в корзину;
- appendToBasket(product: IProductList): void - Метод, добавляющий товар в корзину;
- removeFromBasket(product: IProductList): void - Метод, удаляющий товар из корзины;
- getButtonStatus(product: TProductBasket): string - Метод возвращает статус кнопки для продукта. Кнопка имеет два состояния: "купить", если товара ещё нет в корзине и "удалить" в обратном случае;
- getBasketPrice(): number - Метод вычисляющий и возвращающий общую стоимость продуктов в корзине;
- getBasketQuantity(): number - Метод, возвращающий количество продуктов в корзине;
- clearBasket(): void - Метод для очистки всей корзины;
  }

### Интерфейс модели данных заказа

- interface IModelOrder {
- formErrors: TFormErrors - Объект содержащий ошибки валидации форм;
- order: IOrder - Объект, представляющий данные текущего заказа;
- setPayment(value: string): void - Метод, устанавливающий способ оплаты в заказе;
- setOrderEmail(value: string): void - Метод, устанавливающий электронную почту в заказе;
- setOrderField(field: keyof TOrderInput, value: string): void - Метод, обновляющий любое поле заказа на основе его имени и значения, после чего инициирующий валидацию;
- setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void - Метод, обновляющий все поля заказа;
- validateOrder(): boolean - Метод, который выполняет валидацию заказа и сли одно из полей не заполнено, добавляет в соответствующее поле сообщение об ошибке;
- clearOrder(): void - Метод, очищающий данные заказа;
  }

### Интерфейс продукта

interface IProductList {

- title: string - Название товара;
- category: string - Категория товара;
- id: string - Id товара;
- discription: string - Описание товара;
- image: string - Изображение товара;
- price: number | null - Цена товара;
  }

### Интерфейс заказа

interface IOrder {

- items: string[] - Массив заказов;
- total: number - Количество позиций;
- phone: string - Номер телефона клиента;
- email: string - Электронная почта клиента;
- address: string - Адрес места доставки;
- payment: string - Цена заказа;
  }

---

## События, которые могут быть вызваны в приложении

- card:change - Измененить массива карточек продукта;
- card:selected - Открыть поп-ап карточки продукта;
- card:basket - Добавленить товар в корзину;
- preview:change - Измененть карточку продукта в поп-ап;
- popup:open - Открыть поп-апа;
- popup:close - Закрыть поп-апа;
- basket:open - Открыть корзину;
- basket:close - Закрываем корзину;
- basket:change - Изменить счётчик товаров корзины, измененть сумму приобретенных продуктов, измененить корзину;
- order:open - Открыть окно оформления заказа с первой формой;
- order:change - Изменить поля формы оформления заказа;
- order:submit - Перенаправить пользователя на заполнение данных;
- /^order\..\*:changed/ - Устанавливить валидность полей и инициировать передачу данных;
- contacts:submit - Отправит POST-запрос на сервер, открыть окно, уведомляющее об успешном оформлении заказа и очистить корзину.

---

## Стек и структура проекта

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

---

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```
