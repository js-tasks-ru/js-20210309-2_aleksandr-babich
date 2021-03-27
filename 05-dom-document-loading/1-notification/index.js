export default class NotificationMessage {
  static staticElement;
  static setTimeout;
  element;

  constructor(
    message = '',
    {
      duration = 0,
      type = ''
    } = {}
  ) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.destroy();
    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
                ${this.message}
            </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    if (!NotificationMessage.staticElement) {
      NotificationMessage.staticElement = element.firstElementChild;
      this.element = NotificationMessage.staticElement;
    }
  }

  show(targetElement) {
    const body = document.querySelector('body');

    if (targetElement) {
      targetElement.innerHTML = this.element.outerHTML;
    }

    body.append(this.element);

    this.remove();
  }

  destroy() {
    if (NotificationMessage.staticElement) {
      NotificationMessage.staticElement.remove();
      NotificationMessage.staticElement = null;
    }
  }

  remove() {
    if (NotificationMessage.setTimeout) {
      clearTimeout(NotificationMessage.setTimeout);
    }

    NotificationMessage.setTimeout = setTimeout(this.destroy, this.duration);
  }
}
