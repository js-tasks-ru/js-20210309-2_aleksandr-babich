import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements;
  sortField;
  sortDirection;
  start = 0;
  end = 30;
  step = 30;
  data = [];

  onClick = (event) => {
    console.log('sort');
    const targetElement = event.target.closest('div');

    if (JSON.parse(targetElement.dataset.sortable.toLowerCase()) === false) {
      return;
    }

    this.sortField = targetElement.dataset.id;

    this.addArrow();

    this.render();
  }

  onScroll = (event) => {
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );


    if (window.scrollY >= scrollHeight - innerHeight) {
      console.log('bottom');

      this.start = this.end;
      this.end = this.end + this.step;

      this.render();
      this.sorData();
    }
  }

  constructor(
    headerConfig = [],
    {
      url = ''
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.path = url;
    this.sortField = this.headerConfig.filter(({sortable}) => sortable ?? false)[0].id;

    this.buildElement();
    this.initEventListeners();
    this.render();
  }

  async dataProvider () {
    const baseUrl = new URL(BACKEND_URL);
    const url = new URL(this.path, baseUrl);

    this.sortOnServer(this.sortField, this.sortDirection);
    url.searchParams.set('_sort', this.sortField);
    url.searchParams.set('_order', this.sortDirection);
    url.searchParams.set('_start', String(this.start));
    url.searchParams.set('_end', String(this.end));

    try {
      return await fetchJson(url.toString());
    } catch (e) {
      console.log(e);
    }
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaders()}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${this.getBody()}
            </div>
        </div>
      </div>
    `;
  }

  getHeaders() {
    return this.headerConfig
      .map(item => {
        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
            <span>${item.title}</span>
            ${this.getArrow(item)}
          </div>
        `;
      })
      .join('');
  }

  getArrow(headerCell) {
    if (headerCell.sortable) {
      return `
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
      `;
    }

    return '';
  }

  getBody() {
    const tableCells = this.headerConfig.map(({id, template}) => {
      return {id, template};
    });

    return this.data
      .map(item => {
        return `
          <a id="${item.id}" href="/products/${item.id}" class="sortable-table__row">
            ${this.getCells(tableCells, item)}
          </a>
        `;
      })
      .join('');
  }

  getCells(tableCells, oneProduct) {
    return tableCells
      .map(({id, template}) => {
        if (template) {
          return template(oneProduct[id]);
        }

        return `<div class="sortable-table__cell">${oneProduct[id]}</div>`;
      })
      .join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  buildElement() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.addArrow();
  }

  async render(isJsSort = false) {
    const data = await this.dataProvider();
    this.data = await data;

    if (isJsSort) {
      this.sorData();
    }

    this.subElements.body.innerHTML = await this.getBody();
  }

  sorData() {
    const localeCompare = (firstArg, secondArg) => String(firstArg)
      .localeCompare(String(secondArg), ['ru', 'en'], {caseFirst: 'upper', numeric: true});

    this.data = Object.values(this.data).sort(
      (a, b) => this.sortDirection === 'desc'
        ? localeCompare(b[this.sortField], a[this.sortField])
        : localeCompare(a[this.sortField], b[this.sortField])
    );
  }

  //This method was added only for runnig 07-async-code-fetch-api-part-1/2-sortable-table-v3/index.spec.js:97 test
  //For current realization this method useless
  sortOnServer(sortField, sortDirection) {
  }

  addArrow() {
    let element = this.subElements.header.querySelector(`[data-id="${this.sortField}"]`);

    const arrowSwitcher = (direction) => {
      const sortDirections = {
        asc: 'desc',
        desc: 'asc',
      };

      return sortDirections[direction] ?? 'asc';
    };

    this.sortDirection = arrowSwitcher(element.dataset.order);

    this.subElements.header
      .querySelectorAll('.sortable-table__cell[data-id]')
      .forEach(item => item.setAttribute('data-order', ''));

    element.dataset.order = this.sortDirection;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onClick);
    window.addEventListener('scroll', this.onScroll);
  }

  destroy() {
    this.element.remove();

    window.removeEventListener('scroll', this.onScroll);
  }
}
