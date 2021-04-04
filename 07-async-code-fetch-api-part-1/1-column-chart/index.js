import customFetch from './utils/fetch-json.js';

export default class ColumnChart {
  chartHeight = 50;

  constructor(
    {
      url = '',
      range = {},
      label = '',
      link = '',
      formatHeading = null
    } = {}
  ) {
    this.urlPath = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.dataProvider();
    this.initEventListeners();
  }

  async dataProvider () {
    const baseUrl = new URL('https://course-js.javascript.ru/');
    const url = new URL(this.urlPath, baseUrl);

    Object.entries(this.range).forEach(([key, value]) => url.searchParams.set(key, value));

    try {
      const data = await customFetch(url);
      await this.show(data);
    } catch (e) {
      console.log(e);
    }
  }

  async update(dateFrom, dateTo) {
    this.range = {from: dateFrom, to: dateTo};

    await this.dataProvider();
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  getBody(data) {
    const maxValue = Math.max(...data);
    const heightIndex = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * heightIndex)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getTemplate(data = [], value = '') {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getBody(data)}
          </div>
        </div>
      </div>
    `;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  show(data = {}) {
    const values = Object.entries(data).map(([key, value]) => value);

    if (!values.length) {
      this.element.classList.add('column-chart_loading');
      return;
    }

    this.subElements.header.innerHTML = values.reduce((accum, value) => accum += value, 0);
    this.subElements.body.innerHTML = this.getBody(values);
    this.element.classList.remove('column-chart_loading');
  }

  initEventListeners() {
    //
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = null;
  }
}
