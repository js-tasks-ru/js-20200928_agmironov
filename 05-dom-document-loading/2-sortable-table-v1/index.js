export default class SortableTable {

  constructor(header = [], {data = []} = {}) {
    this._header = header;
    this._data = data;
    this._customData = [...this._data];
    this._fieldValue = "";
    this._orderValue = null;

    this._render();
  }

  sort(fieldValue, orderValue) {
    this._fieldValue = fieldValue;
    this._orderValue = orderValue;
    this._customData = this._sortData();
    this._subElements.header.innerHTML = this._generateHeaderHtml();
    this._subElements.body.innerHTML = this._generateDataHtml();
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

  _sortData() {
    return [...this._data.sort(this._getComparator())];
  }

  _getComparator() {
    const columnInfo = this._header.find(elem => elem.id === this._fieldValue);
    if (columnInfo && ["asc", "desc"].includes(this._orderValue)) {
      const direction = this._orderValue === "asc" ? 1 : -1;
      switch (columnInfo.sortType) {
      case "string": return (item1, item2) => direction * item1[this._fieldValue]
          .localeCompare(item2[this._fieldValue], ['ru', 'en'], {caseFirst: "upper"});
      case "number": return (item1, item2) => direction * (parseInt(item1[this._fieldValue]) - parseInt(item2[this._fieldValue]));
      }
    }
    return () => 0;
  }

  _render() {
    this.element = this._generateElement();
    this._subElements = this._getSubElements(this.element);
  }

  _generateElement() {
    const element = document.createElement("div");
    element.innerHTML = this._generateHtml();
    return element.firstElementChild;
  }

  _generateHtml() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this._generateHeaderHtml()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this._generateDataHtml()}
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
      <div class="sortable-table__cell" data-id="images" data-sortable="false" ${this._orderValue ? `data-order="${this._orderValue}"` : ""}>
        <span>${info.title}</span>${this._getArrowIfNeed(info, this._fieldValue, this._orderValue)}
      </div>`;
  }

  _getArrowIfNeed(info) {
    if (this._fieldValue === info.id) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
    }
    return "";
  }

  _generateDataHtml() {
    return this._customData.reduce((result, dataItem) => {
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

