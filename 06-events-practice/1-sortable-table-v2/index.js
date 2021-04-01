export default class SortableTable {
  element;
  subElements;
  sortField;
  sortDirection;

  handleEventHeaderClick = (event) => {
    this.sortField = event.target.closest('div').dataset.id;

    this.addArrow();

    this.sort();
  }

  constructor(
    headerConfig = [],
    {
      data = [],
      sortByField = null,
      direction = null
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sortField = sortByField;
    this.sortDirection = direction;

    this.buildElement();
  }

  set sortField(value) {

  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaders()}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${this.getBody(this.data)}
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
    if(headerCell.sortable) {
      return `
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
      `;
    }

    return '';
  }

  getBody(bodyData) {
    const tableCells = this.headerConfig.map(({id, template}) => {
      return {id, template};
    });

    return bodyData
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
    if (this.sortField === null) {
      this.sortField = this.headerConfig.filter(({sortable}) => sortable)[0].id;
    }

    this.sorData();

    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.addEventListener(this.subElements.header, 'pointerdown', this.handleEventHeaderClick);

    this.addArrow();
  }

  sort() {
    this.sorData();

    this.subElements.body.innerHTML = this.getBody(this.data);

    this.subElements = this.getSubElements(this.element);
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

  destroy() {
    this.element.remove();
  }

  addEventListener(object, eventName, handler) {
    object.addEventListener(eventName, handler);
  }

  addArrow() {
    let element = this.subElements.header.querySelector(`[data-id="${this.sortField}"]`);

    this.subElements.header
      .querySelectorAll('.sortable-table__cell[data-id]')
      .forEach(item => item.setAttribute('data-order', ''));

    if (this.sortDirection === null || this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else {
      this.sortDirection = 'desc';
    }

    element.dataset.order = this.sortDirection;
  }
}
