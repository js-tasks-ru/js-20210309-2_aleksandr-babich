export default class SortableList {
  items;
  element;

  draggingEle;
  placeholder;
  isDraggingStarted = false;

  currentPositionX = 0;
  currentPositionY = 0;

  onMouseMove = (event) => {
    this.draggingEle.style.position = 'absolute';
    this.draggingEle.style.top = `${event.pageY - this.currentPositionY}px`;
    this.draggingEle.style.left = `${event.pageX - this.currentPositionX}px`;

    const prevEle = this.draggingEle.previousElementSibling;
    const nextEle = this.placeholder.nextElementSibling;

    if (prevEle && this.isAbove(this.draggingEle, prevEle)) {
      this.swap(this.placeholder, this.draggingEle);
      this.swap(this.placeholder, prevEle);
      return;
    }

    if (nextEle && this.isAbove(nextEle, this.draggingEle)) {
      this.swap(nextEle, this.placeholder);
      this.swap(nextEle, this.draggingEle);
    }
  }

  onMouseUp = (event) => {
    if (this.placeholder) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    this.draggingEle.classList.remove('sortable-list__item_dragging');

    this.draggingEle.style.removeProperty('top');
    this.draggingEle.style.removeProperty('left');
    this.draggingEle.style.removeProperty('position');

    this.currentPositionX = null;
    this.currentPositionY = null;
    this.draggingEle = null;
    this.isDraggingStarted = false;

    this.destroy();
  }

  onPointerDown = (event) => {
    const targetElement = event.target;
console.log(targetElement);
    this.draggingEle = event.target.closest('li');

    if (targetElement.dataset.deleteHandle) {
      this.draggingEle.remove();
      return;
    }

    const draggingRect = this.draggingEle.getBoundingClientRect();

    if (!this.isDraggingStarted) {
      this.isDraggingStarted = true;

      this.placeholder = document.createElement('li');
      this.placeholder.classList.add('sortable-list__placeholder');
      this.draggingEle.parentNode.insertBefore(this.placeholder, this.draggingEle.nextSibling);
      this.placeholder.style.height = `${draggingRect.height}px`;
    }

    this.draggingEle.classList.add('sortable-list__item_dragging');
    this.draggingEle.style.width = '100%';

    const rect = this.draggingEle.getBoundingClientRect();
    this.currentPositionX = event.pageX - rect.left;
    this.currentPositionY = event.pageY - rect.top;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  constructor(
    {
      items = ''
    } = {}
  ) {
    this.items = items;

    this.render();
    this.initEvent();
  }

  render () {
    const element = document.createElement('ul');

    element.classList.add('sortable-list');

    this.items.forEach((li, index)=> {
      li.classList.add('sortable-list__item');
      li.children[li.children.length - 1].dataset.deleteHandle = index;

      element.appendChild(li);
    });

    this.element = element;
  }

  swap (nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    nodeB.parentNode.insertBefore(nodeA, nodeB);

    parentA.insertBefore(nodeB, siblingA);
  }

  isAbove (nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
  }

  initEvent () {
    const pointerdown = new MouseEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      view: window
    });

    this.element.dispatchEvent(pointerdown);

    this.element.addEventListener('pointerdown', this.onPointerDown);
  }

  remove () {
    this.element.remove();
  }

  destroy () {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
