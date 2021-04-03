class Tooltip {
  static instance;

  onPointerOver = (event) => {
    let element = event.target.closest('[data-tooltip]');

    if (!element) {
      return;
    }
    this.render(element.dataset.tooltip);
    this.addCoordinates(event.pageX, event.pageY);

    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove = (event) => {
    let element = event.target.closest('[data-tooltip]');

    this.element.remove();

    if (element) {
      this.render(element.dataset.tooltip);
      this.addCoordinates(event.pageX, event.pageY);

      document.addEventListener('pointerout', this.onPointerOut);
    }
  }

  onPointerOut = (event) => {
    this.destroy();

    document.addEventListener('pointerover', this.onPointerOver);
  }

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  initialize() {
    this.body = document.querySelector('body');

    this.buildBaseElement();

    document.addEventListener('pointerover', this.onPointerOver);
  }

  addCoordinates(pageX, pageY) {
    const offset = 5;

    this.element.style.left = (pageX + offset) + 'px';
    this.element.style.top = (pageY + offset) + 'px';
  }

  buildBaseElement() {
    this.element = document.createElement('div');
  }

  render(element) {
    this.element.innerHTML = element;

    this.element.id = 'container';
    this.element.classList.add('tooltip');

    this.element.style.position = 'absolute';

    this.body.append(this.element);
  }

  destroy() {
    this.element.remove();

    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}

const tooltip = new Tooltip();

export default tooltip;
