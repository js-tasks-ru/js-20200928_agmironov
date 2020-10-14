export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  update(data) {
    this.data = data;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.className = `column-chart ${this.data.length > 0 ? '' : 'column-chart_loading'}`;
    element.innerHTML = this._generateHtml();

    this.element = element;
  }

  _generateHtml() {
    return `
    <div class='column-chart__title'>
        Total ${this.label}
        ${this._getLinkHTML(this.link)}
      </div>
      <div class="column-chart__container">
        <div class="column-chart__header">${this.value}</div>
        <div class="column-chart__chart">
          ${this._getDataHTML(this.data)}
        </div>
      </div>
`;
  }

  _getLinkHTML(link) {
    return link ? `<a class="column-chart__link" href="${this.link}">Посмотреть все</a>` : '';
  }

  _getDataHTML(data) {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return data.map(item =>
      `<div
        style="--value: ${String(Math.floor(item * scale))}"
        data-tooltip="${(item / maxValue * 100).toFixed(0)}%"
      ></div>`
    ).join('');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
