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
    this.element.innerHTML = this._generateHtml();
  }

  get subElements() {
    if (this.element) {
      const prokatilo = {body : this.element.lastElementChild.lastElementChild.lastElementChild};
      return prokatilo;
    }
    return null;
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
            ${this._generateHeader(this._fieldValue, this._orderValue)}
            ${this._generateDataHtml()}
        </div>
      </div>`;
  }

  _generateHeader() {
    const result = [];
    result.push(`<div data-element="header" class="sortable-table__header sortable-table__row">`);
    this._header.forEach(info => result.push(this._generateOneHeaderCell(info)));
    result.push(`</div>`);
    return result.join("");
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
    const result = [];
    result.push(`<div data-element="body" class="sortable-table__body">`);
    this._customData.forEach(dataItem => result.push(this._generateDataRow(dataItem)));
    result.push("</div>");
    return result.join("\n");
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

}

