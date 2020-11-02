export default class DoubleSlider {
  element;
  _subElements = {};

  constructor({
    min = 100,
    max = 200,
    formatValue = value => '$' + value,
    selected = {
      from: min,
      to: max
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this._formatValue = formatValue;
    this._selected = selected;

    // generate element
    this._render();

    this._subElements = this._getSubElements(this.element);

    this._initEventListeners();

    this._update();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this._onThumbPointerMove);
    document.removeEventListener('pointerup', this._onThumbPointerUp);
  }

  _render() {
    const element = document.createElement('div');

    element.innerHTML = this._template();

    this.element = element.firstElementChild;
    this.element.ondragstart = () => false;
  }

  _update() {
    const rangeTotal = this.max - this.min;
    const left = Math.floor((this._selected.from - this.min) / rangeTotal * 100) + '%';
    const right = Math.floor((this.max - this._selected.to) / rangeTotal * 100) + '%';

    this._subElements.progress.style.left = left;
    this._subElements.progress.style.right = right;

    this._subElements.thumbLeft.style.left = left;
    this._subElements.thumbRight.style.right = right;
  }

  _initEventListeners() {
    const { thumbLeft, thumbRight } = this._subElements;

    thumbLeft.addEventListener('pointerdown', event => this._onThumbPointerDown(event));
    thumbRight.addEventListener('pointerdown', event => this._onThumbPointerDown(event));
  }

  _template() {
    const { from, to } = this._selected;

    return `<div class="range-slider">
      <span data-element="from">${this._formatValue(from)}</span>
      <div data-element="inner" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress"></span>
        <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
        <span data-element="thumbRight" class="range-slider__thumb-right"></span>
      </div>
      <span data-element="to">${this._formatValue(to)}</span>
    </div>`;
  }

  _getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  _getValue() {
    const rangeTotal = this.max - this.min;
    const { left } = this._subElements.thumbLeft.style;
    const { right } = this._subElements.thumbRight.style;

    const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

    return { from, to };
  }

  _onThumbPointerDown(event) {
    const thumbElem = event.target;

    event.preventDefault();

    const { left, right } = thumbElem.getBoundingClientRect();

    if (thumbElem === this._subElements.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }

    this.dragging = thumbElem;

    this.element.classList.add('range-slider_dragging');

    document.addEventListener('pointermove', this._onThumbPointerMove);
    document.addEventListener('pointerup', this._onThumbPointerUp);
  }

  _onThumbPointerMove = event => {
    event.preventDefault();

    const { left: innerLeft, right: innerRight, width } = this._subElements.inner.getBoundingClientRect();

    if (this.dragging === this._subElements.thumbLeft) {
      let newLeft = Math.max((event.clientX - innerLeft + this.shiftX) / width, 0) * 100;

      const right = parseFloat(this._subElements.thumbRight.style['right']);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }
      this.dragging.style.left = this._subElements.progress.style.left = newLeft + '%';
      this._subElements.from.innerHTML = this._formatValue(this._getValue().from);
    }

    if (this.dragging === this._subElements.thumbRight) {
      let newRight = Math.max((innerRight - event.clientX - this.shiftX) / width, 0) * 100;

      const left = parseFloat(this._subElements.thumbLeft.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }
      this.dragging.style.right = this._subElements.progress.style.right = newRight + '%';
      this._subElements.to.innerHTML = this._formatValue(this._getValue().to);
    }
  };

  _onThumbPointerUp = () => {
    this.element.classList.remove('range-slider_dragging');

    document.removeEventListener('pointermove', this._onThumbPointerMove);
    document.removeEventListener('pointerup', this._onThumbPointerUp);

    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: this._getValue(),
      bubbles: true
    }));
  };

}
