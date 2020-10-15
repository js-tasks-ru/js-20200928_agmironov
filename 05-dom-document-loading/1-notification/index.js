let curNotification;

export default class NotificationMessage {

  constructor(message = "", {duration = 0, type = 'success'} = {}) {
    // инкапсуляцие))
    this._message = message;
    this._duration = duration;
    this._type = type;

    this._render();
  }

  show(target = document.body) {
    this._replaceNotification();
    target.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  get duration() {
    return this._duration;
  }

  get type() {
    return this._type;
  }

  get message() {
    return this._message;
  }

  remove() {
    curNotification = null;
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  _replaceNotification() {
    if (curNotification) {
      curNotification.destroy();
    }
    curNotification = this;
  }

  _render() {
    this.element = this._generateHtml();
  }

  _generateHtml() {
    const element = document.createElement("div");
    element.innerHTML = `<div class="notification ${this.type}" style="--value:${this.duration}ms">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>`;
    return element.firstElementChild;
  }

}
