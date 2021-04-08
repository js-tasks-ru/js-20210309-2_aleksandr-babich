import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  PRODUCT_PATH = '/api/rest/products';
  CATEGORY_PATH = '/api/rest/categories';
  categories = [];

  get template () {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" required="" type="text" name="title" class="form-control" value="${this.product ? escapeHtml(this.product.title) : ''}" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.product ? escapeHtml(this.product.description) : ''}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">
                ${this.getImages()}
              </ul>
              </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
              ${this.getCategories()}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100" value="${this.product ? this.product.price : 100}">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.product ? this.product.discount : 0}">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.product ? this.product.quantity : 1}">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              <option value="1" ${this.product && (this.product.status === 1) ? 'selected="selected"' : ''}>Активен</option>
              <option value="0" ${this.product && (this.product.status === 0) ? 'selected="selected"' : ''}>Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getImages () {
    if (!this.product || !this.product.images) {
      return '';
    }

    return this.product.images.map(image => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${image.url}">
          <input type="hidden" name="source" value="${image.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `;
    })
    .join('');
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.subElements.productForm = event.target;

    this.save();
  }

  constructor (productId = '') {
    this.productId = productId;
    this.baseUrl = new URL(BACKEND_URL);
  }

  async render () {
    const element = document.createElement('div');
    this.categories = await this.dataProvider(
      this.CATEGORY_PATH,
      {_sort: 'weight', _refs: 'subcategory'}
    );

    if (this.productId !== '') {
      const product = await this.dataProvider(
        this.getPath(this.PRODUCT_PATH, {products: this.productId}),
        {
          queryParameters: {_sort: 'weight', _refs: 'subcategory'}
        }
      );

      this.product = Array.isArray(product) ? product[0] : product;
    }

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initEventListener();

    return this.element;
  }

  async update (data = {}) {
    await this.dataProvider(
      this.PRODUCT_PATH,
      {id: this.productId},
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    this.dispatchEvent('product-updated');
  }

  async create (data = {}) {
    await this.dataProvider(
      this.PRODUCT_PATH,
      {},
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    this.dispatchEvent('product-saved');
  }

  async save () {
    const form = new FormData(this.subElements.productForm);
    const data = {
      images: []
    };

    form.forEach((value, key) => {
      data[key] = this.mutator(key, value);
    });

    if (this.productId === '') {
      await this.create(data);
      return;
    }

    await this.update(data);
  }

  dataProvider (
    path = '',
    queryParameters = {},
    parameters = {}
  ) {
    const url = new URL(path, this.baseUrl);

    Object.entries(queryParameters).forEach(([key, value]) => url.searchParams.set(key, value));

    return fetchJson(url, parameters);
  }

  getCategories () {
    return this.categories.map(category => {
      if (category.subcategories && category.subcategories.length) {
        return category.subcategories.map(subcategory => {
          return `
            <option value="${subcategory.id}" ${this.product && (subcategory.id === this.product.subcategory) ? 'selected="selected"' : ''}>
                ${category.title} &gt; ${subcategory.title}
            </option>
          `;
        })
        .join('');
      }

      return `
        <option value="${category.id} ${category.id === this.product.subcategory ? 'selected="selected"' : ''}">${category.title}</option>
      `;
    })
    .join('');
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  getPath(path = '', iDs = {}) {
    const pathArray = path.split('/');

    return pathArray.map(partUrl => {
      return iDs[partUrl] ? `${partUrl}/${iDs[partUrl]}` : partUrl;
    })
    .join('/');
  }

  mutator (key = '', variable = '') {
    const matcher = {
      description: (item) => escapeHtml(item),
      discount: (item) => Number(item),
      quantity: (item) => Number(item),
      price: (item) => Number(item),
      status: (item) => Number(item),
      title: (item) => escapeHtml(item),
      subcategory: (item) => escapeHtml(item)
    };

    return matcher[key] ? matcher[key](variable) : variable;
  }

  remove () {
    this.element.remove();
    this.subElements = null;
  }

  destroy () {
    this.remove();
  }

  initEventListener () {
    this.subElements.productForm.addEventListener('submit', this.onSubmit);
  }

  dispatchEvent (eventName) {
    this.element.dispatchEvent(new CustomEvent(eventName, {detail: { event: `Event ${eventName} was dispatched!` }}));
  }
}
