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

_Методы:_

- handleResponse - Логика обработки ответа сервера, вынесенная в отдельную функцию;
- GET - Функция принимающая url в качестве аргумента, и отправляющая на него GET-запрос;
- POST - Функция принимающая url , data - объект с данными, представляющий собой тело запроса и метод передачи данных(по умолчанию POST). параметра при вызове.

### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в presenter для обработки событий и в слоях приложения для генерации событий.

_Методы:_

- on - Подписка на событие;
- off - Отписка от события;
- emit - Инициализация события.

### Класс Component

Абстрактный класс, на основе которого строятся все остальные компоненты интерфейса. Он предоставляет общие методы для управления DOM-элементами, например, переключение классов, установка текстового содержимого компонента, управление видимостью и т.д.

---

## Слой Model:

Model отвечает за хранение данных и обработку бизнес-логики приложения, таких как данные продуктов, корзины и заказов.

### Класс ModelProducts

Класс отвечает за хранение данных товара и логику работы с ними. В конструктор принимает экземпляр класса EventEmitter.

_Методы:_

- setProducts - Метод для заполнения массива карточек продуктов;
- getProducts - Возвращает массив карточек продуктов;
- addProduct - Метод добавляет товар в начало списка продуктов;
- getProduct - Возвращает одну карточку продуктов по его id;
- get products - Геттер products возвращает текущий список продуктов.

### Класс ModelBasket

Класс отвечает за хранение данных корзины и логику работы с ней. В конструктор принимает экземпляр класса EventEmitter.

_Методы:_

- appendToBasket - Метод для добавления товара в корзину;
- removeFromBasket - Метод для удаления товара из корзины;
- isBasketCard - Метод проверяет находится ли товар в корзине;
- getBasketPrice - Метод вычисляет и возвращает общую стоимость продуктов в корзине;
- getBasketQuantity - Метод возвращает количество продуктов в корзине;
- clearBasket - Метод для очистки всей корзины;
- get products - Геттер возвращает текущий список продуктов в корзине.

### Класс ModelOrder

Класс отвечает за хранение и работу с данными заказа. В конструктор принимает экземпляр класса EventEmitter.

_Данные:_

- \_formErrors — Объект содержащий ошибки валидации форм;
- \_order — Объект, представляющий данные текущего заказа. Содержит следующие поля:
  - email — Электронная почта клиента;
  - phone — Номер телефона клиента;
  - address — Адрес доставки;
  - payment — Способ оплаты.

_Методы:_

- setPayment - Устанавливает способ оплаты в заказе;
- setOrderAddress - Устанавливает адрес доставки в заказе;
- setOrderEmail - Устанавливает электронную почту в заказе;
- setOrderField - Обновляет любое поле заказа на основе его имени и значения, после чего инициирует валидацию;
- validateOrder - Выполняет валидацию заказа. Проверяет наличие значений в обязательных полях (email, phone, address, payment). Если одно из полей не заполнено, добавляет сообщение об ошибке;
- get formErrors - Геттер возвращает текущие ошибки формы заказа;
- get order - Геттер возвращает текущий объект заказа.

---

## Слой View:

Слой View управляет отображением данных и обработкой событий пользовательского интерфейса, таких как клики на карточки продуктов и кнопки.

### Класс Popup

Класс Popup относится к слою представления (View) приложения. Класс наследуется от родительского класса Component. Показывает поп-ап пользователю/покупателю. Предоставляет методы open, close, render для управления отображением поп-апом. Устанавливает слушатели для закрытия поп-ап по Esc, на клик в оверлей и кнопку закрытия.

_Конструктор принимает два аргумента:_

- container - корневой элемент поп-ап в DOM, переданный в качестве HTMLElement;
- events - объект, реализующий интерфейс событий.

### Класс Card

Класс Card отвечает за отображение карточки товара и корзины, задавая в карточке данные категории, заголовка, изображения, цены и описания, так же добавление и удаление товаров в корзине. Данный клавсс является родительским для всех видов карточек. В свою очередь, данный класс наследуется от родительского класса Component и используется для отображения карточек на странице сайта.

_Конструктор принимает один аргумент:_

- container: HTML-элемент, который будет служить контейнером для карточки.

### Класс Basket

Класс Basket отвечает за управление корзиной товаров на странице, в частности: отображение списка товаров, расчет общей стоимости и обработку пользовательских действий, таких как оформление заказа.

_Конструктор класса принимает два аргумента:_

- container: HTML-элемент, который будет служить контейнером для корзины;
- events: объект, используемый для обработки событий.

_Методы:_

- updateButtonState — Метод, который обновляет состояние кнопки оформления заказа в зависимости от общей стоимости товаров. Блокирует кнопку, если стоимость товаров равно нулю;
- set price — Сеттер устанавливает общую стоимость товаров в корзине;
- set items — Сеттер для обновления списка товаров в корзине.

### Класс Form

Класс Form представляет компонент формы в веб-приложении. Наследуется от класса Component.

_Конструктор класса принимает два аргумента:_

- container: HTML-элемент формы, который будет служить контейнером для компонента;
- events: объект, реализующий интерфейс IEvents, используемый для обработки событий.

_Методы:_

- onInputChange — Метод вызывается при изменении значения любого поля ввода в форме;
- render - Метод используется для обновления состояния формы;
- set valid — Сеттер устанавливает состояние валидности формы. Он принимает значение типа boolean и устанавливает атрибут disabled на кнопке отправки формы в зависимости от значения. Если значение true, кнопка становится активной, если false - неактивной;
- set errors — Сеттер устанавливает текст ошибок формы.

### Класс Payment

Класс Payment так же относится к слою представления (View) приложения. Отвечает за управление выбором способа оплаты и адресом доставки в форме заказа. Наследуется от класса Form и определяет тип данных формы оплаты.

_Конструктор принимает два аргумента:_

- container: HTML-элемент формы оплаты, который будет служить контейнером для компонента;
- events: объект, реализующий интерфейс обработки событий.

_Методы:_

- resetPayment — метод для сброса состояния кнопок оплаты, используется при переключении кнопок;
- togglePayment — Метод для переключения активного способа оплаты. Сбрасывает предыдущий выбор и активирует выбранную кнопку;
- set address — Cеттер для поля адреса, который устанавливающий адрес доставки.

### Класс Contacts

Класс Contacts твечает за управление контактной информацией в форме заказа. Наследуется от класса Form.

_Методы:_

- set email — сеттер для поля электронной почты;
- set number — сеттер для поля электронной почты.

### Класс Page

Класс Page предназначен для управления визуальной частью страницы, в частности каталогом товаров, счетчиком корзины и блокировкой страницы.
Этот класс используется для управления элементами страницы, обрабатывает события и изменяет визуальное представление в зависимости от состояния страницы.

_Конструктор принимает два аргумента:_

- container: HTML-элемент, содержащий страницу, с которой будет работать класс;
- events: Объект, содержащий события, которые будут вызваны в процессе работы с страницей.

_Методы:_

- set counter - Устанавливает значение счетчика товаров в корзине;
- set catalog - Устанавливает массив элементов HTML, представляющих товары в каталоге;
- set locked - Устанавливает или снимает блокировку страницы.

---

## Слой Presenter:

Основной функционал слоя presenter в приложении выполняет брокер событий EventEmitter. Брокер событий управляет взаимодействием между Model и Views, передавая между ними события и обеспечивая логику обновления данных, реагируя на действия пользователя. Все события, связанные с действиями пользователя, передаются через брокер.

### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.

### Класс AppApi

Класс AppApi предоставляет методы для взаимодействия с API приложения, в частности для получения данных о продуктах и оформления заказов. Он инкапсулирует базовый API (\_baseApi) и добавляет логику для работы с изображениями.

_Конструктор принимает два аргумента:_

- url - URL для изображений;
- baseApi - Экземпляр базового API.

_Методы:_

- getProducts - Метод возвращает массив объектов продуктов и добавляет изображение к каждому продукту;
- getProduct - Метод возращает определенный продукт по его идентификатору;
- orderProducts - Метод отправляет заказ на сервис.

---

## Интерфейсы данных и их типизация:

### Интерфейс модели данных продукта

- interface IModelProducts {
- products: IProductList[];
- setProducts(products: IProductList[]): void;
- getProducts(): IProductList[];
- getProduct(id: string): IProductList;
  }

### Интерфейс модели данных корзины

- interface IModelBasket {
- products: TProductBasket[];
- appendToBasket(product: IProductList): void;
- removeFromBasket(product: IProductList): void;
- getButtonStatus(product: TProductBasket): string;
- getBasketPrice(): number;
- getBasketQuantity(): number;
- clearBasket(): void;
  }

### Интерфейс модели данных заказа

- interface IModelOrder {
- formErrors: TFormErrors;
- order: IOrder;
- setPayment(value: string): void;
- setOrderEmail(value: string): void;
- setOrderField(field: keyof TOrderInput, value: string): void;
- etOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
- validateOrder(): boolean;
- clearOrder(): void;
  }

### Интерфейс продукта

interface IProductList {

- title: string;
- category: string;
- id: string;
- discription: string;
- image: string;
- price: number | null;
  }

### Интерфейс заказа

interface IOrder {

- items: string[];
- total: number;
- phone: string;
- email: string;
- address: string;
- payment: string;
  }

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
