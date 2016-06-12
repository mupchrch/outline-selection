'use babel';

export default class OutlineSelectionView {

  constructor() {
    const CSS_CLASS = 'outline-selection';
    const POSITION = 'absolute';
    const Z_INDEX = 100;

    let outlineTopElem = document.createElement('div');
    outlineTopElem.classList.add(CSS_CLASS);
    outlineTopElem.classList.add('outline-selection-top');
    outlineTopElem.style.position = POSITION;
    outlineTopElem.style.zIndex = Z_INDEX;

    let outlineBottomElem = document.createElement('div');
    outlineBottomElem.classList.add(CSS_CLASS);
    outlineBottomElem.classList.add('outline-selection-bottom');
    outlineBottomElem.style.position = POSITION;
    outlineBottomElem.style.zIndex = Z_INDEX;

    let outlineLeftElem = document.createElement('div');
    outlineLeftElem.classList.add(CSS_CLASS);
    outlineLeftElem.classList.add('outline-selection-left');
    outlineLeftElem.style.position = POSITION;
    outlineLeftElem.style.zIndex = Z_INDEX;

    let outlineRightElem = document.createElement('div');
    outlineRightElem.classList.add(CSS_CLASS);
    outlineRightElem.classList.add('outline-selection-right');
    outlineRightElem.style.position = POSITION;
    outlineRightElem.style.zIndex = Z_INDEX;

    this.outline = {
      top: outlineTopElem,
      bottom: outlineBottomElem,
      left: outlineLeftElem,
      right: outlineRightElem,
    }
  }

  /**
   * Attaches the outline elements to a view.
   * @param  {[type]} view The view to attach the elements of the outline to.
   */
  attach(view) {
    this.view = view;
    let scrollView = view.shadowRoot.querySelector('.scroll-view');
    scrollView.appendChild(this.outline.top);
    scrollView.appendChild(this.outline.bottom);
    scrollView.appendChild(this.outline.left);
    scrollView.appendChild(this.outline.right);
  }

  // Tear down any state and detach
  destroy() {
    this.outline.top.remove();
    this.outline.bottom.remove();
    this.outline.left.remove();
    this.outline.right.remove();
  }

  /**
   * Hides the outline elements, thus hiding the outline.
   */
  hide() {
    this.outline.top.style.display = 'none';
    this.outline.bottom.style.display = 'none';
    this.outline.left.style.display = 'none';
    this.outline.right.style.display = 'none';
  }

  /**
   * Shows the outline elements, thus showing the outline.
   */
  show() {
    this.outline.top.style.display = 'block';
    this.outline.bottom.style.display = 'block';
    this.outline.left.style.display = 'block';
    this.outline.right.style.display = 'block';
  }

  /**
   * Gets the view that the outline is attached to.
   * @return {View} The view that the outline is attached to.
   */
  getView() {
    return this.view;
  }

  /**
   * Sets the position of the outline elements.
   * @param {Object} topPosition    The position to set the top element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} bottomPosition The position to set the bottom element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} leftPosition   The position to set the left element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} rightPosition  The position to set the right element to.
   *                                Contains a top and left, which are numbers.
   */
  setPosition(topPosition, bottomPosition, leftPosition, rightPosition) {
    this.outline.top.style.top = topPosition.top + 'px';
    this.outline.top.style.left = topPosition.left + 'px';

    this.outline.bottom.style.top = bottomPosition.top + 'px';
    this.outline.bottom.style.left = bottomPosition.left + 'px';

    this.outline.left.style.top = leftPosition.top + 'px';
    this.outline.left.style.left = leftPosition.left + 'px';

    this.outline.right.style.top = rightPosition.top + 'px';
    this.outline.right.style.left = rightPosition.left + 'px';
  }

  /**
   * Sets the size of the outline elements.
   * @param {Object} topSize    The size to set the top element to. Contains a
   *                            width and height, which are numbers.
   * @param {Object} bottomSize The size to set the bottom element to. Contains
   *                            a width and height, which are numbers.
   * @param {Object} leftSize   The size to set the left element to. Contains a
   *                            width and height, which are numbers.
   * @param {Object} rightSize  The size to set the right element to. Contains a
   *                            width and height, which are numbers.
   */
  setSize(topSize, bottomSize, leftSize, rightSize) {
    this.outline.top.style.width = topSize.width + 'px';
    this.outline.top.style.height = topSize.height + 'px';

    this.outline.bottom.style.width = bottomSize.width + 'px';
    this.outline.bottom.style.height = bottomSize.height + 'px';

    this.outline.left.style.width = leftSize.width + 'px';
    this.outline.left.style.height = leftSize.height + 'px';

    this.outline.right.style.width = rightSize.width + 'px';
    this.outline.right.style.height = rightSize.height + 'px';
  }

  /**
   * Sets the border CSS and the opacity for the outline elements.
   * @param {string} borderCss The value to set the border CSS property to.
   *                           Value will look like '1px solid rgba()'.
   * @param {number} opacity   The value to set the opacity of the outline
   *                           elements to.
   */
  setStyle(borderCss, opacity) {
    this.outline.top.style.borderTop = borderCss;
    this.outline.top.style.borderLeft = borderCss;
    this.outline.top.style.opacity = opacity;

    this.outline.bottom.style.borderBottom = borderCss;
    this.outline.bottom.style.borderRight = borderCss;
    this.outline.bottom.style.opacity = opacity;

    this.outline.left.style.borderTop = borderCss;
    this.outline.left.style.borderLeft = borderCss;
    this.outline.left.style.opacity = opacity;

    this.outline.right.style.borderBottom = borderCss;
    this.outline.right.style.borderRight = borderCss;
    this.outline.right.style.opacity = opacity;
  }
}
