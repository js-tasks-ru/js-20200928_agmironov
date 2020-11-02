class Tooltip {
  static _tooltip;

  element;

  constructor() {
    if (Tooltip._tooltip) {
      return Tooltip._tooltip;
    }

    Tooltip._tooltip = this;
  }

  initialize() {
    this._initEventListeners();
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = html;

    document.body.append(this.element);
  }

  destroy() {
    document.removeEventListener('pointerover', this._onMouseOver);
    document.removeEventListener('pointerout', this._onMouseOut);
    this._removeTooltip();
  }

  _initEventListeners() {
    document.addEventListener('pointerover', this._onMouseOver);
    document.addEventListener('pointerout', this._onMouseOut);
  }

  _moveTooltip(event) {
    const left = event.clientX + 5;
    const top = event.clientY + 5;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  _removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener('pointermove', this._onMouseMove);
    }
  }

  _onMouseOver = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      this._moveTooltip(event);

      document.addEventListener('pointermove', this._onMouseMove);
    }
  };

  _onMouseMove = event => {
    this._moveTooltip(event);
  };

  _onMouseOut = () => {
    this._removeTooltip();
  };

}

const tooltip = new Tooltip();

export default tooltip;
