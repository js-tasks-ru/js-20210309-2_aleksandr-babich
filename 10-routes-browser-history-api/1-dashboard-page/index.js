import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  range = {};
  element;

  async render () {
    this.setRange();
    const titleH3 = document.createElement('h3');
    this.element = document.createElement('div');

    titleH3.innerText = 'Лидеры продаж';
    titleH3.classList.add('block-title');
    this.element.classList.add('dashboard');

    await this.element.append(this.getTopPanel());
    await this.element.append(this.getDashboardChart());
    this.element.append(titleH3);
    await this.element.append(this.getSortableTable());

    this.subElements = this.getSubElements(this.element);

    return this.element;
  }

  getSortableTable () {
    const element = document.createElement('div');
    const sortableTable = new SortableTable(header, { url: 'api/rest/products'});

    element.classList.add('sortable-table');
    element.dataset.element = 'sortableTable';
    element.append(sortableTable.element);

    return element;
  }

  getDashboardChart () {
    const element = document.createElement('div');
    const columnChartPayload = [
      {
        url: 'api/dashboard/orders',
        range: this.range,
        label: 'orders',
        link: '#'
      },
      {
        url: 'api/dashboard/sales',
        range: this.range,
        label: 'sales',
      },
      {
        url: 'api/dashboard/customers',
        range: this.range,
        label: 'customers',
      }
    ];

    element.classList.add('dashboard__charts');

    columnChartPayload.forEach((item, index) => {
      const columnChart = new ColumnChart(item);

      columnChart.element.classList.add(`dashboard__chart_${item.label}`);
      columnChart.element.dataset.element = `${item.label}Chart`;

      element.append(columnChart.element);
    });

    return element;
  }

  getTopPanel () {
    const {from, to} = this.range;
    const rangePicker = new RangePicker({from, to});
    const titleH2 = document.createElement('h2');
    const element = document.createElement('div');

    titleH2.innerText = 'Панель управления';
    titleH2.classList.add('page-title');

    element.append(titleH2);
    element.classList.add('content__top-panel');
    element.append(rangePicker.element);
    element.dataset.element = 'rangePicker';

    return element;
  }

  setRange () {
    this.range = {
      from: (() => {
        const toDay = new Date();
        toDay.setMonth(toDay.getMonth() - 1);
        toDay.setDate(toDay.getDate() + 1);

        return toDay;
      })(),
      to: new Date(),
    };
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();
  }
}
