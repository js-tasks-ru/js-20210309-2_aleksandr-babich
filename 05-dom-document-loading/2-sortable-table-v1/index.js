export default class SortableTable {
  element;
  tableColumns;
  subElements;

  constructor(
    headerConfig = [],
    {
      data = []
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.buildElement();
  }

  getTemplate(headerConfig, bodyData, order = '') {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaders(headerConfig, order)}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${this.getBody(bodyData)}
            </div>
        </div>
      </div>
    `;
  }

  getHeaders(header, order = '') {
    this.tableColumns = [];

    return header
      .map(item => {
        if (item.sortType === 'number') {
          this.tableColumns.push(item.id);
        }

        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
            <span>${item.title}</span>
            ${(() => item.sortable ? `
                <span data-element="arrow" class="sortable-table__sort-arrow">
                  <span class="sort-arrow"></span>
                </span>
            ` : '')()}
          </div>
        `;
      })
      .join('');
  }

  getBody(bodyData) {
    return Object.values(bodyData)
      .map(item => {
        return `
          <a id="${item.id}" href="/products/${item.id}" class="sortable-table__row">
            ${this.getImage(item.images)}

            <div class="sortable-table__cell">${item.title}</div>

            ${this.getCells(item)}
          </a>
        `;
      })
      .join('');
  }

  getImage(images) {
    return images ? `
        <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${images[0].url}">
        </div>
    ` : '';
  }

  getCells(oneProduct) {
    return this.tableColumns
      .map(item => {
        if (oneProduct.hasOwnProperty(item) === false) {
          return '';
        }

        if (oneProduct.template) {
          return oneProduct.template;
        }

        return `<div class="sortable-table__cell">${oneProduct[item]}</div>`;
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

    element.innerHTML = this.getTemplate(this.headerConfig, this.data);

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  sort(fieldValue, orderValue) {
    this.sorData(fieldValue, orderValue);

    this.subElements.header
      .querySelectorAll('.sortable-table__cell[data-id]')
      .forEach(item => item.setAttribute('data-order', ''));
    this.subElements.header
      .querySelector(`[data-id="${fieldValue}"]`).setAttribute('data-order', orderValue);

    this.subElements.body.innerHTML = this.getBody(this.data);

    this.subElements = this.getSubElements(this.element);
  }

  sorData(fieldValue, orderValue) {
    const localeCompare = (firstArg, secondArg) => String(firstArg)
      .localeCompare(String(secondArg), ['ru', 'en'], {caseFirst: 'upper', numeric: true});

    this.data = Object.values(this.data).sort(
      (a, b) => orderValue === 'desc'
        ? localeCompare(b[fieldValue], a[fieldValue])
        : localeCompare(a[fieldValue], b[fieldValue])
    );
  }

  destroy() {
    this.element.remove();
  }
}

