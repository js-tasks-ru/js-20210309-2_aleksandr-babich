class Tooltip {
  static instance;

  onPointerOver = (event) => {
    const element = event.target.closest('[data-tooltip]');

    if (!element) {
      return;
    }

    this.render(element.dataset.tooltip);
    this.addCoordinates(event.pageX, event.pageY);

    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove = (event) => {
    this.addCoordinates(event.pageX, event.pageY);
  }

  onPointerOut = () => {
    this.removeTooltip();
  }

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  initialize() {
    this.body = document.querySelector('body');

    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  addCoordinates(pageX, pageY) {
    const offset = 5;

    this.element.style.left = (pageX + offset) + 'px';
    this.element.style.top = (pageY + offset) + 'px';
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener('pointermove', this.onPointerMove);
    }
  }

  render(element) {
    this.element = document.createElement('div');

    this.element.innerHTML = element;

    this.element.id = 'container';
    this.element.classList.add('tooltip');

    this.element.style.position = 'absolute';

    this.body.append(this.element);
  }

  destroy() {
    this.removeTooltip();

    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
  }
}

const tooltip = new Tooltip();

export default tooltip;
