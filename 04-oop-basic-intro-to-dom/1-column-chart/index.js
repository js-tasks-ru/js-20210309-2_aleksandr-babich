export default class ColumnChart {
  chartHeight = 50;

  constructor(
    {
      data = [],
      label = '',
      link = '',
      value = 0,
    } = {}
  ) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
    this.initEventListeners();
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

  render() {
    const element = document.createElement('div'); // (*)

    element.innerHTML = `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getBody(this.data)}
          </div>
        </div>
      </div>
    `;

    if (this.data.length) {
      element.querySelector('.column-chart').classList.remove('column-chart_loading');
    }

    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  update(data) {
    this.data = data;
  }
}
