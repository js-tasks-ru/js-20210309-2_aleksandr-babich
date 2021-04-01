class Tooltip {
  static instance;

  pointeroverHandlerEventListener = (event) => {
    let tooltipElement = event.target.dataset.tooltip;

    this.render(tooltipElement);

    this.element.style.left = event.pageX + 5 + 'px';
    this.element.style.top = event.pageY + 5 + 'px';
  }

  pointeroutHandlerEventListener = (event) => {
    this.destroy();
  }

  initialize(params = {}) {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    this.body = document.querySelector('body');
    this.tooltipElements = this.body.querySelectorAll("[data-tooltip]")[0];

    this.addEventListener(this.tooltipElements, 'pointerover', this.pointeroverHandlerEventListener);
    this.addEventListener(this.tooltipElements, 'pointerout', this.pointeroutHandlerEventListener);

    return Tooltip.instance;
  }

  render(element = '') {
    const container = document.createElement('div');

    container.innerHTML = element;


    container.id = 'container';
    container.classList.add('tooltip');

    container.style.position = 'absolute';
    container.style.zIndex = 1000;

    this.element = container;

    this.body.append(this.element);
  }

  addEventListener(object, eventName, handler) {
    object.addEventListener(eventName, handler);
  }

  removeEventListener(object, eventName, handler) {
    object.removeEventListener(eventName, handler);
  }

  destroy() {
    this.element.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
