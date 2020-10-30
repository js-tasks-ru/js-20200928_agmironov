export default class SortableTable {

  constructor(header = [], {data = []} = {}) {
    this._header = header;
    this._data = data;
    this._sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    };

    this._render();
  }

  get subElements() {
    return this._subElements;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  _sortData(fieldId, order) {
    return [...this._data.sort(this._getComparator(fieldId, order))];
  }

  _getComparator(fieldId, order) {
    const columnInfo = this._header.find(elem => elem.id === fieldId);
    switch (columnInfo.sortType) {
    case "string": return (item1, item2) => this._getDirection(order)
      * item1[fieldId].localeCompare(item2[fieldId], ['ru', 'en'], {caseFirst: "upper"});
    case "number": return (item1, item2) => this._getDirection(order)
      * (parseInt(item1[fieldId]) - parseInt(item2[fieldId]));
    }
    return () => 0;
  }

  _getDirection(order) {
    switch (order) {
    case "asc" : return 1;
    case "desc" : return -1;
    default : return 0;
    }
  }

  _render() {
    this.element = this._generateElement();
    this._subElements = this._getSubElements(this.element);
    this._subElements.arrow = this.element.querySelector('.sortable-table__sort-arrow');
    this._initEventListeners();
  }

  _initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  _generateElement() {
    const element = document.createElement("div");
    element.innerHTML = this._generateHtml();
    return element.firstElementChild;
  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order = "asc" } = column.dataset;
      const sortedData = this._sortData(id, toggleOrder(order));
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = toggleOrder(order);

      if (!arrow) {
        column.append(this._subElements.arrow);
      }

      this._subElements.body.innerHTML = this._generateDataHtml(sortedData);
    }
  };

  _generateHtml() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this._generateHeaderHtml()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this._generateDataHtml(this._sortData(this._sorted.id, this._sorted.order))}
          </div>
        </div>
      </div>`;
  }

  _generateHeaderHtml() {
    return this._header.reduce((result, info) => {
      result.push(this._generateOneHeaderCell(info));
      return result;
    }, []).join("");
  }

  _generateOneHeaderCell(info) {
    return `
      <div class="sortable-table__cell" data-id="${info.id}" data-sortable="${info.sortable}">
        <span>${info.title}</span>
        ${info.id === this._sorted.id ? this._getArrowHtml() : ""}
      </div>`;
  }

  _getArrowHtml() {
    return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
  }

  _generateDataHtml(data) {
    return data.reduce((result, dataItem) => {
      result.push(this._generateDataRow(dataItem));
      return result;
    }, []).join("\n");
  }

  _generateDataRow(dataItem) {
    const result = [];
    result.push(`<a href="/products/${dataItem.id}" class="sortable-table__row">`);
    this._header.forEach(info => result.push(
      info.template
        ? info.template(dataItem[info.id])
        : `<div class="sortable-table__cell">${dataItem[info.id]}</div>`
    ));
    result.push("</a>");
    return result.join("\n");
  }

  _getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }

}
